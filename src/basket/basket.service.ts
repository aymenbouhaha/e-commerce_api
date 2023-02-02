import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {BasketEntity} from "./entity/basket.entity";
import {Repository} from "typeorm";

@Injectable()
export class BasketService {

    constructor(
        @InjectRepository(BasketEntity)
        private basketRepository : Repository<BasketEntity>
    ) {
    }


    // addToBasket(, user : Partial<UserEntity>){
    //
    //
    //
    // }


    async getBaskets() {
        const basket = await this.basketRepository.findOne({where: {id : 1},relations : ["user" , "basketProduct"]})
        delete basket.user.salt
        delete basket.user.password
        delete basket.user.role
        return basket
    }
}
