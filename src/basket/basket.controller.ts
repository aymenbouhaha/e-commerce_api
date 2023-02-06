import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards} from '@nestjs/common';
import { BasketService } from './basket.service';
import {JwtAuthGuard} from "../user/guard/jwt-auth.guard";
import {User} from "../decorator/user.decorator";
import {UserEntity} from "../user/entity/user.entity";
import {ProductOrderDto} from "../order/dto/product-order.dto";


@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}


  @Get()
  @UseGuards(JwtAuthGuard)
  getBasket(@User() user : Partial<UserEntity>){
    return this.basketService.getBasket(user)
  }

  @Post("add")
  @UseGuards(JwtAuthGuard)
  addToBasket(@User() user : Partial<UserEntity>,@Body() productToBasket : ProductOrderDto){
    return this.basketService.addToBasket(user,productToBasket)
  }

  @Delete("delete/:id")
  @UseGuards(JwtAuthGuard)
  deleteProduct(@User() user: Partial<UserEntity>, @Param("id", ParseIntPipe) productId){
    return this.basketService.removeFromBasket(user,productId)
  }



}
