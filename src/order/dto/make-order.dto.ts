import {IsArray, IsNotEmpty} from "class-validator";
import {ProductOrderDto} from "./product-order.dto";

export class MakeOrderDto{

    @IsArray()
    @IsNotEmpty()
    product : ProductOrderDto[]



}