import {IsNumber, IsOptional} from "class-validator";
import {Type} from "class-transformer";

export class PaginateDto {

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    page: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    nb: number;

}
