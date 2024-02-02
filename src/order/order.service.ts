import {ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {OrderEntity} from "./entity/order.entity";
import {DataSource, QueryRunner, Repository} from "typeorm";
import {UserEntity, UserRole} from "../user/entity/user.entity";
import {ProductService} from "../product/product.service";
import {MakeOrderDto} from "./dto/make-order.dto";
import {ProductEntity} from "../product/entity/product.entity";
import {OrderProductEntity} from "./entity/order-product.entity";
import {BasketProductEntity} from "../basket/entity/basket-product.entity";
import {GetProductDto} from "../common/get-product.dto";

@Injectable()
export class OrderService {


    constructor(
        @InjectRepository(OrderEntity)
        private orderRepository : Repository<OrderEntity>,
        private productService : ProductService,
        private dataSource : DataSource
    ) {
    }


    async getOrders(user: Partial<UserEntity> , paginationOptions : GetProductDto){
        let skip= null;
        let take = 15;
        if ( paginationOptions.page){
            skip = (paginationOptions.page -1)*take
        }
        if (user.role==UserRole.admin){
            return await this.orderRepository.find(
                {
                    relations : ["client", "orderProducts", "orderProducts.product", "orderProducts.product.images"],
                    take : take,
                    skip : skip
                }
            )
        }else {
            return await this.orderRepository.find(
                {
                    where : {client : { id : user.id }}, relations : ["orderProducts" , "orderProducts.product", "orderProducts.product.images"],
                    take : take,
                    skip : skip
                }
            )
        }
    }



    async makeOrder(user : Partial<UserEntity>, productsToOrder : MakeOrderDto){

        if (user.role!=UserRole.client){
            throw new UnauthorizedException("l'admin ne peut pas faire des commandes")
        }
        let product
        let products : ProductEntity[] = []
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        for (const productToOrder of productsToOrder.product) {
            product= await this.productService.getProductByIdWithQueryRunner(queryRunner.manager,productToOrder.id)
            if (!product){
                await this.releaseTransaction(queryRunner)
                throw new ConflictException("L'un des produits n'existe pas")
            }
            if (productToOrder.itemsNumber>product.itemsNumber){
                await this.releaseTransaction(queryRunner)
                throw new ConflictException("La quantité que vous demandez est superieur a la quantité existante dans le stock")
            }
            products.push(product)
        }
        try {
            const order=queryRunner.manager.create(OrderEntity,{
                client : user,
                orderProducts : []
            })
            let newItemNumber: number
            for (let i=0;i<products.length;i++){
                newItemNumber = products[i].itemsNumber-productsToOrder.product[i].itemsNumber
                await queryRunner.manager.update<ProductEntity>(ProductEntity,products[i].id,{itemsNumber: newItemNumber})
                const orderProduct : OrderProductEntity = new OrderProductEntity()
                orderProduct.itemsNumber=productsToOrder.product[i].itemsNumber
                orderProduct.product=products[i]
                order.orderProducts.push(orderProduct)
                await queryRunner.manager.delete(BasketProductEntity,{product : products[i], productBasket: user.basket})
            }
            await queryRunner.manager.save(OrderEntity,order)
            await queryRunner.commitTransaction()
            return order
        }
        catch (e) {
            await this.releaseTransaction(queryRunner)
            throw new ConflictException("La commande n'est pas effectué veuillez essayer ultirierement")
        }
    }


    private async releaseTransaction(queryRunner: QueryRunner) {
        await queryRunner.rollbackTransaction()
        await queryRunner.release()
    }


}
