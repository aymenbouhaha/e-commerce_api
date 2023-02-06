import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {BasketEntity} from "./entity/basket.entity";
import {ProductModule} from "../product/product.module";
import {BasketProductEntity} from "./entity/basket-product.entity";

@Module({
  imports: [TypeOrmModule.forFeature([BasketEntity,BasketProductEntity]), ProductModule],
  controllers: [BasketController],
  providers: [BasketService]
})
export class BasketModule {}
