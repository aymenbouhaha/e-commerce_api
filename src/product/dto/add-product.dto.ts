import {IsArray, IsNotEmpty, IsNumber, IsPositive, IsString} from "class-validator";

export class AddProductDto{

    @IsString()
    @IsNotEmpty()
    name : string


    @IsNumber()
    @IsNotEmpty()
    price : number


    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    itemsNumber : number


    @IsString()
    @IsNotEmpty()
    categoryName : string


    @IsArray()
    images : string[]


}