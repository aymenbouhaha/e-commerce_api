import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserModule} from './user/user.module';
import {OrderModule} from './order/order.module';
import {ProductModule} from './product/product.module';
import {CategoryModule} from './category/category.module';
import {DiscountModule} from './discount/discount.module';
import {UserEntity} from "./user/entity/user.entity";
import {OrderEntity} from "./order/entity/order.entity";
import {ProductEntity} from "./product/entity/product.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ImageEntity} from "./product/entity/image.entity";
import {CategoryEntity} from "./category/entity/category.entity";
import {DiscountEntity} from "./discount/entity/discount.entity";
import {ConfigModule} from "@nestjs/config";
import { BasketModule } from './basket/basket.module';
import {BasketEntity} from "./basket/entity/basket.entity";
import {OrderProductEntity} from "./order/entity/order-product.entity";
import {BasketProductEntity} from "./basket/entity/basket-product.entity";


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal : true
        }),
        UserModule,
        OrderModule,
        ProductModule,
        CategoryModule,
        DiscountModule,
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '',
            database: 'e-commerce',
            entities: [UserEntity, OrderEntity, ProductEntity,ImageEntity,CategoryEntity,DiscountEntity,BasketEntity, OrderProductEntity, BasketProductEntity],
            synchronize: true,
        }),
        BasketModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
