import {IsEmail, IsNotEmpty, IsPhoneNumber, IsString} from "class-validator";

export class SignUpDto {

    @IsString()
    @IsNotEmpty()
    firstName : string

    @IsString()
    @IsNotEmpty()
    lastName : string

    @IsString()
    @IsNotEmpty()
    address : string


    @IsEmail()
    @IsNotEmpty()
    email : string

    @IsString()
    @IsNotEmpty()
    password : string

    @IsPhoneNumber()
    @IsNotEmpty()
    phoneNumber : string
}