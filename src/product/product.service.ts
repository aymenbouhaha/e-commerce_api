import {ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import {EntityManager, Repository} from "typeorm";
import {ProductEntity} from "./entity/product.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {AddProductDto} from "./dto/add-product.dto";
import {UserEntity, UserRole} from "../user/entity/user.entity";
import {CategoryService} from "../category/category.service";
import {ImageEntity} from "./entity/image.entity";
import {UpdateProductDto} from "./dto/update-product.dto";
import { v4 as uuidv4 } from 'uuid';
import sharp from "sharp";
import {PaginateDto} from "../common/paginate.dto";

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(ProductEntity)
        private productRepository : Repository<ProductEntity>,
        private categoryService : CategoryService
    ) {
    }

    async getProducts(paginationOptions : PaginateDto) {
        let skip= null;
        let take = null;
        if (paginationOptions.nb && paginationOptions.page){
            skip = (paginationOptions.page -1)*paginationOptions.nb
            take=paginationOptions.nb
        }
        return await this.productRepository.find(
            {
                relations: ["images", "category" , "discount"],
                skip : skip,
                take : take
            }
        )
    }

    async getProductByCategory(categoryName : string, paginationOptions : PaginateDto){
        const category = await this.categoryService.getCategroyByName(categoryName)
        if (!category){
            throw new ConflictException("la category n'existe pas")
        }
        let skip= null;
        let take = null;
        if (paginationOptions.nb && paginationOptions.page){
            skip = (paginationOptions.page -1)*paginationOptions.nb
            take=paginationOptions.nb
        }
        return this.productRepository.find(
            {
                where : {category : category},
                relations : ["images", "category" , "discount"],
                take:take,
                skip: skip
            }
        )
    }


    async addProduct(newProduct : AddProductDto, user : Partial<UserEntity>, images : Array<Express.Multer.File>){
        if (user.role!= UserRole.admin){
            throw new UnauthorizedException()
        }
        const {categoryName , ...partialProduct}=newProduct
        const category= await this.categoryService.getCategroyByName(categoryName)
        if (!category){
            throw new ConflictException("la category n'existe pas")
        }
        const product=this.productRepository.create({
            ...partialProduct,
            category : category,
            images : []
        })
        for (const image of images) {
        {
            const imageEntity : ImageEntity= new ImageEntity()
            imageEntity.name=uuidv4()+image.originalname
            imageEntity.type=image.mimetype
            const buffer=await sharp(image.buffer).resize(100).toBuffer()
            product.images.push(imageEntity)
        }
    }
        try {
            return await this.productRepository.save(product)
        }catch (e){
            throw new ConflictException("le produit n'est pas ajouté")
        }
    }

    async getProductById(id: number) {
        return await this.productRepository.findOneBy({id : id})
    }

    async getProductByIdWithQueryRunner(manager : EntityManager,id : number){
        return await manager.findOne(
            ProductEntity,
            {
                where:{
                    id : id
                },
                lock: {
                    mode : "pessimistic_write"
                }
            }
        )
    }


    async updateProduct(user : Partial<UserEntity>, productId : number, criteria: UpdateProductDto){
        if (user.role != UserRole.admin)
            throw new UnauthorizedException()
        try {
            return await this.productRepository.update(productId,criteria)
        }catch (e) {
            throw new ConflictException("Un probleme est survenue lors de la mise a jour des informations du produit")
        }
    }


    // @Post('add-image')
    // @UseInterceptors(FilesInterceptor('images'))
    // async addImages(user : Partial<UserEntity>, productId : number, ){
    //
    // }



}
