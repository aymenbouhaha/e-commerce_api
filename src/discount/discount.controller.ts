import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards} from '@nestjs/common';
import { DiscountService } from './discount.service';
import {JwtAuthGuard} from "../user/guard/jwt-auth.guard";
import {User} from "../decorator/user.decorator";
import {UserEntity} from "../user/entity/user.entity";
import {AddDiscountDto} from "./dto/add-discount.dto";
import {GetProductDto} from "../common/get-product.dto";

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}



  @Get()
  getDiscounts(@Query() params : GetProductDto){
    return this.discountService.getDiscounts(params)
  }


  @Post("add")
  @UseGuards(JwtAuthGuard)
  addDicsount(@User() user : Partial<UserEntity>, @Body() discountToAdd : AddDiscountDto){
    return this.discountService.addDiscount(user,discountToAdd)
  }

  @Delete("delete/:id")
  @UseGuards(JwtAuthGuard)
  removeDiscount(@User() user : Partial<UserEntity>,@Param("id", ParseIntPipe) discountId : number ){
    return this.discountService.removeDiscount(user,discountId)
  }



}
