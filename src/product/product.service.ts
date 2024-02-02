import {ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import {EntityManager, Repository} from "typeorm";
import {ProductEntity} from "./entity/product.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {AddProductDto} from "./dto/add-product.dto";
import {UserEntity, UserRole} from "../user/entity/user.entity";
import {CategoryService} from "../category/category.service";
import {UpdateProductDto} from "./dto/update-product.dto";
import {GetProductDto} from "../common/get-product.dto";
import { ImagesArray } from "../common/constant";


@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(ProductEntity)
        private productRepository : Repository<ProductEntity>,
        private categoryService : CategoryService
    ) {
    }

    async getProducts(paginationOptions : GetProductDto) {
        let skip= null;
        let take = 10;
        if (paginationOptions.page){
            skip = (paginationOptions.page -1)*10
        }
        let length
        if (paginationOptions.category){
            const category = await this.categoryService.getCategroyByName(paginationOptions.category)
            if (!category){
                throw new ConflictException("la category n'existe pas")
            }
            length = await this.productRepository.count({
                where : {
                    category : {
                        id : category.id
                    }
                }
            })
            const products = await this.productRepository.find(
                {
                    where : {category : category},
                    relations : ["category"],
                    take:take,
                    skip: skip
                }
            )
            return {
                products : products,
                length : length
            }
        }
        const products=await  this.productRepository.find(
            {
                relations: ["category"],
                skip : skip,
                take : take
            }
        )
        length = await this.productRepository.count()
        return  {
            products : products,
            length : length
        }
    }


    private getRandomElements(arr: string[], numberOfElements: number): string[] {
        const shuffledArray = arr.sort(() => Math.random() - 0.5);
        return shuffledArray.slice(0, numberOfElements);
    }


    async addProduct(newProduct : AddProductDto, user : Partial<UserEntity>){
        if (user.role!= UserRole.admin){
            throw new UnauthorizedException()
        }
        let images: string[]
        if (!newProduct.images){
            images=this.getRandomElements(ImagesArray,4)
        }else {
            images=newProduct.images
        }
        console.log(images);
        const {categoryName , ...partialProduct}=newProduct
        const category= await this.categoryService.getCategroyByName(categoryName)
        if (!category){
            throw new ConflictException("la category n'existe pas")
        }
        const product=this.productRepository.create({
            ...partialProduct,
            images : images,
            category : category,
        })
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



}
