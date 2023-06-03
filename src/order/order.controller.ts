import {Body, Controller, Get, Param, Post, UseGuards} from "@nestjs/common";
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../user/guard/jwt-auth.guard';
import { MakeOrderDto } from './dto/make-order.dto';
import { User } from '../decorator/user.decorator';
import { UserEntity } from '../user/entity/user.entity';
import {GetProductDto} from "../common/get-product.dto";

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('make')
  @UseGuards(JwtAuthGuard)
  async makeOrder(
    @Body() makeOrder: MakeOrderDto,
    @User() user: Partial<UserEntity>,
  ) {
    return await this.orderService.makeOrder(user, makeOrder);
  }
  @Get()
  @UseGuards(JwtAuthGuard)
  async getOrders(@User() user: Partial<UserEntity>,@Param() paginationOptions: GetProductDto) {
    return await this.orderService.getOrders(user,paginationOptions);
  }
}
