import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../user/guard/jwt-auth.guard';
import { MakeOrderDto } from './dto/make-order.dto';
import { User } from '../decorator/user.decorator';
import { UserEntity } from '../user/entity/user.entity';

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
  async getOrders(@User() user: Partial<UserEntity>) {
    return await this.orderService.getOrders(user);
  }
}
