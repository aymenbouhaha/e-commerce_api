import {Body, Controller, Get, Post, Query, UploadedFiles, UseGuards, UseInterceptors} from '@nestjs/common';
import { ProductService } from './product.service';
import {AddProductDto} from "./dto/add-product.dto";
import {JwtAuthGuard} from "../user/guard/jwt-auth.guard";
import {User} from "../decorator/user.decorator";
import {UserEntity} from "../user/entity/user.entity";
import {FilesInterceptor} from "@nestjs/platform-express";
import {PaginateDto} from "../common/paginate.dto";
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post("add")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor(
      "images",
      10,
      {
        fileFilter :
            (req, file, callback)=>{
              if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return callback(new Error('Vous pouvez ajouter que des images'), false);
              }
              callback(null, true);
            }
      }
  ))
  async addProduct(
      @Body() newProduct : AddProductDto,
      @User() user : Partial<UserEntity>,
      @UploadedFiles() images : Array<Express.Multer.File>
  ){
    return this.productService.addProduct(newProduct,user,images)
  }

  @Get()
  getProducts(@Query() paginateDto : PaginateDto){
    return this.productService.getProducts(paginateDto)
  }

  @Get(':id')
  async getProductById(@Param() id: number) {
    return await this.productService.getProductById(id);
  }

  @Patch(':id')
  async updateProduct(
    @Param() id: number,
    @Body() productDto: UpdateProductDto,
    @User() user: Partial<UserEntity>,
  ) {
    return await this.productService.updateProduct(user, id, productDto);
  }

  @Get('category/:categoryName')
  async getProductByCategory(@Param() categoryName: string) {
    return await this.productService.getProductByCategory(categoryName);
  }



}
