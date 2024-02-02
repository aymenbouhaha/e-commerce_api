import { IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, IsPositive, IsString } from "class-validator";
import {Type} from "class-transformer";

export class AddProductDto{

    @IsString()
    @IsNotEmpty()
    name : string

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    price : number

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    itemsNumber : number


    @IsString()
    @IsNotEmpty()
    categoryName : string

    @IsString()
    @IsNotEmpty()
    description : string

    @IsArray()
    @IsOptional()
    images : string[]



}
