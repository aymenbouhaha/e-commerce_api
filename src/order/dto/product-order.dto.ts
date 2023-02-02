import {IsNotEmpty, IsNumber, IsPositive} from "class-validator";

export class ProductOrderDto{

    @IsNotEmpty()
    @IsNumber()
    id : number

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    itemsNumber: number
}