import {ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {OrderEntity} from "./entity/order.entity";
import {Repository} from "typeorm";
import {UserEntity, UserRole} from "../user/entity/user.entity";
import {ProductService} from "../product/product.service";

@Injectable()
export class OrderService {

    constructor(
        @InjectRepository(OrderEntity)
        private orderRepository : Repository<OrderEntity>,
        private productService : ProductService
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
    async makeOrder(user : Partial<UserEntity>, productId : number){
        if (user.role!=UserRole.client){
            throw new UnauthorizedException("l'admin ne peut pas faire des commandes")
        }
        const product= await this.productService.getProductById(productId)
        if (!product){
            throw new ConflictException("Le produit n'existe pas")
        }
        if (product.itemsNumber<0){

        }

    }


}
