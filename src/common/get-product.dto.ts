import {IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class GetProductDto {

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    page: number;


    @IsOptional()
    @IsString()
    category : string

}
