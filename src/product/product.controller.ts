import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import { ProductService } from './product.service';
import {AddProductDto} from "./dto/add-product.dto";
import {JwtAuthGuard} from "../user/guard/jwt-auth.guard";
import {User} from "../decorator/user.decorator";
import {UserEntity} from "../user/entity/user.entity";

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post("add")
  @UseGuards(JwtAuthGuard)
  async addProduct(@Body() newProduct : AddProductDto, @User() user : Partial<UserEntity>){
    return this.productService.addProduct(newProduct,user)
  }


  @Get()
  getProducts(){
    return this.productService.getProducts()
  }

}
