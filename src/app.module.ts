import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
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
import {CategoryEntity} from "./category/entity/category.entity";
import {DiscountEntity} from "./discount/entity/discount.entity";
import {ConfigModule} from "@nestjs/config";
import { BasketModule } from './basket/basket.module';
import {BasketEntity} from "./basket/entity/basket.entity";
import {OrderProductEntity} from "./order/entity/order-product.entity";
import {BasketProductEntity} from "./basket/entity/basket-product.entity";
import * as dotenv from 'dotenv';
import {MailerModule} from "@nestjs-modules/mailer";
import { HttpLoggerInterceptor } from "./http-logger.interceptor";
import { APP_INTERCEPTOR } from "@nestjs/core";


dotenv.config()
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
        MailerModule.forRoot(
            {
                transport: {
                    service: "hotmail",
                    auth: {
                        user: process.env.MAIL_USER,
                        pass: process.env.MAIL_PASSWORD,
                    },
                },
            }
        ),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'aymen',
            database: 'e-commerce',
            entities: [UserEntity, OrderEntity, ProductEntity,CategoryEntity,DiscountEntity,BasketEntity, OrderProductEntity, BasketProductEntity],
            synchronize: true,
        }),
        BasketModule,
    ],
    controllers: [AppController],
    providers: [
      AppService,
        {
            provide: APP_INTERCEPTOR,
            useClass: HttpLoggerInterceptor,
        }
    ],
})
export class AppModule {

}
