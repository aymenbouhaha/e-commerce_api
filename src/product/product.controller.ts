import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,

} from '@nestjs/common';
import { ProductService } from './product.service';
import {JwtAuthGuard} from "../user/guard/jwt-auth.guard";
import {User} from "../decorator/user.decorator";
import {UserEntity} from "../user/entity/user.entity";
import {GetProductDto} from "../common/get-product.dto";
import { UpdateProductDto } from './dto/update-product.dto';
import {AddProductDto} from "./dto/add-product.dto";

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post("add")
  @UseGuards(JwtAuthGuard)
  async addProduct(
      @Body() newProduct : AddProductDto ,
      @User() user : Partial<UserEntity>,
  ){
    return this.productService.addProduct(newProduct,user)
  }

  @Get()
  getProducts(@Query() paginateDto : GetProductDto){
    return this.productService.getProducts(paginateDto)
  }

  @Get(':id')
  async getProductById(@Param("id",ParseIntPipe) id: number) {
      console.log(id)
    return await this.productService.getProductById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateProduct(
    @Param() id: number,
    @Body() productDto: UpdateProductDto,
    @User() user: Partial<UserEntity>,
  ) {
    return await this.productService.updateProduct(user, id, productDto);
  }





}
