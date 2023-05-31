import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {DiscountEntity} from "./entity/discount.entity";
import {ProductModule} from "../product/product.module";

@Module({
  imports : [TypeOrmModule.forFeature([DiscountEntity]), ProductModule],
  controllers: [DiscountController],
  providers: [DiscountService]
})
export class DiscountModule {}
