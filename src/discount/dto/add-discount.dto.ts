import { IsDateString, IsNotEmpty, IsNumber, Max, Min} from "class-validator";

export class AddDiscountDto{


    @IsDateString()
    @IsNotEmpty()
    startDate : string



    @IsDateString()
    @IsNotEmpty()
    endDate : string


    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(100)
    value : number

    @IsNumber()
    @IsNotEmpty()
    productId: number


}