import {Controller, Get} from '@nestjs/common';
import { BasketService } from './basket.service';


@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}


  @Get()
  getBasket(){
    return this.basketService.getBaskets()
  }


}
