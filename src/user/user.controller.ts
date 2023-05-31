import {Body, Controller, Patch, Post, UseGuards} from '@nestjs/common';
import { UserService } from './user.service';
import {SignUpDto} from "./dto/sign-up.dto";
import {LoginDto} from "./dto/login.dto";
import {JwtAuthGuard} from "./guard/jwt-auth.guard";
import {User} from "../decorator/user.decorator";
import {UserEntity} from "./entity/user.entity";
import {VerifyCodeDto} from "./dto/verify-code.dto";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  signUp(@Body() userData: SignUpDto) {
    return this.userService.signUp(userData);
  }

  @Post('login')
  login(@Body() credentials: LoginDto) {
    return this.userService.login(credentials);
  }


  @UseGuards(JwtAuthGuard)
  @Patch("verify")
  verifyAccount(@User() couple : Partial<UserEntity>,@Body() verifyCredentials : VerifyCodeDto){
    return this.userService.verifyAccount(couple,verifyCredentials)
  }

}
