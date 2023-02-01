import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {OrderEntity} from "./entity/order.entity";
import {ProductModule} from "../product/product.module";

@Module({
  imports : [TypeOrmModule.forFeature([OrderEntity]),ProductModule],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
