import {ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {OrderEntity} from "./entity/order.entity";
import {DataSource, Repository} from "typeorm";
import {UserEntity, UserRole} from "../user/entity/user.entity";
import {ProductService} from "../product/product.service";
import {MakeOrderDto} from "./dto/make-order.dto";
import {ProductEntity} from "../product/entity/product.entity";

@Injectable()
export class OrderService {

    constructor(
        @InjectRepository(OrderEntity)
        private orderRepository : Repository<OrderEntity>,
        private productService : ProductService,
        private dataSource : DataSource
    ) {
    }

    async getOrders(user: Partial<UserEntity>){
        if (user.role==UserRole.admin){
            return await this.orderRepository.find({relations : ["client", "product"]})
        }else {
            return await this.orderRepository.find({where : {client : user}, relations : ["product"]} )
        }
    }

    //TODO : not completed

    // async makeOrder(user : Partial<UserEntity>,productsToOrder : MakeOrderDto){
    //     if (user.role!=UserRole.client){
    //         throw new UnauthorizedException("l'admin ne peut pas faire des commandes")
    //     }
    //     let product
    //     let products : ProductEntity[] = []
    //     for (const productToOrder of productsToOrder.product) {
    //         product= await this.productService.getProductById(productToOrder.id)
    //         if (!product){
    //             throw new ConflictException("L'un des produits n'existe pas")
    //         }
    //         if (productToOrder.itemsNumber>product.itemsNumber){
    //             throw new ConflictException("La quantité que vous demandez est superieur a la quantité existante dans le stock")
    //         }
    //         products.push(product)
    //     }
    //     for (let i=0;i<products.length;i++){
    //         try {
    //             await this.productService.updateProductItemsNumber(product[i],products[i].itemsNumber-productsToOrder.product[i].itemsNumber)
    //         }
    //         catch (e){
    //
    //         }
    //     }

    async makeOrder(user : Partial<UserEntity>, productsToOrder : MakeOrderDto){
        if (user.role!=UserRole.client){
            throw new UnauthorizedException("l'admin ne peut pas faire des commandes")
        }
        let product
        let products : ProductEntity[] = []
        for (const productToOrder of productsToOrder.product) {
            product= await this.productService.getProductById(productToOrder.id)
            if (!product){
                throw new ConflictException("L'un des produits n'existe pas")
            }
            if (productToOrder.itemsNumber>product.itemsNumber){
                throw new ConflictException("La quantité que vous demandez est superieur a la quantité existante dans le stock")
            }
            products.push(product)
        }
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            for (let i=0;i<products.length;i++){
                const newItemNumber = products[i].itemsNumber-productsToOrder.product[i].itemsNumber
                await queryRunner.manager.update(ProductEntity,products[i].id,{itemsNumber: newItemNumber})
            }
            const order=await queryRunner.manager.create(OrderEntity,{
                client: user,
                product : products
            })
            await queryRunner.manager.save(OrderEntity,order)
            await queryRunner.commitTransaction()
            await queryRunner.release()
            return order

        }
        catch (e){
            await queryRunner.rollbackTransaction()
            await queryRunner.release()
            throw new ConflictException("La commande n'est pas effectué veuillez essayer ultirieremet")
        }

    }


}
