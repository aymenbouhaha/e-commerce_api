import {ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import {Repository} from "typeorm";
import {ProductEntity} from "./entity/product.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {AddProductDto} from "./dto/add-product.dto";
import {UserEntity, UserRole} from "../user/entity/user.entity";
import {CategoryService} from "../category/category.service";
import {ImageEntity} from "./entity/image.entity";
import {UpdateProductDto} from "./dto/update-product.dto";

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(ProductEntity)
        private productRepository : Repository<ProductEntity>,
        private categoryService : CategoryService
    ) {
    }

    async getProducts() {
        return await this.productRepository.find({relations: ["images", "category" , "discount"]})
    }

    async getProductByCategory(categoryName : string){
        const category = await this.categoryService.getCategroyByName(categoryName)
        if (!category){
            throw new ConflictException("la category n'existe pas")
        }
        return this.productRepository.find({where : {category : category}})
    }


    async addProduct(newProduct : AddProductDto, user : Partial<UserEntity>){
        if (user.role!= UserRole.admin){
            throw new UnauthorizedException()
        }
        const {categoryName , images , ...partialProduct}=newProduct
        const category= await this.categoryService.getCategroyByName(categoryName)
        if (!category){
            throw new ConflictException("la category n'existe pas")
        }
        const product=this.productRepository.create({
            ...partialProduct,
            category : category,
            images : []
        })
        images.forEach(
            (image)=>{
            {
                const imageEntity : ImageEntity= new ImageEntity()
                imageEntity.src=image
                product.images.push(imageEntity)
            }
        }
        )
        try {
            return await this.productRepository.save(product)
        }catch (e){
            throw new ConflictException("le produit n'est pas ajouté")
        }
    }

    async getProductById(id: number) {
        return await this.productRepository.findOneBy({id : id})
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
