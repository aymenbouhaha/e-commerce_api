import {Body, Controller, Param, Patch, Post, UseGuards} from '@nestjs/common';
import { UserService } from './user.service';
import {SignUpDto} from "./dto/sign-up.dto";
import {LoginDto} from "./dto/login.dto";
import {JwtAuthGuard} from "./guard/jwt-auth.guard";
import {User} from "../decorator/user.decorator";
import {UserEntity} from "./entity/user.entity";
import {VerifyCodeDto} from "./dto/verify-code.dto";
import {UpdateUserDto} from "./dto/update-user.dto";

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
  @Patch('update')
  update(@User() user : Partial<UserEntity>, @Body() userData: UpdateUserDto) {
    return this.userService.update(user, userData);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("verify")
  verifyAccount(@User() user : Partial<UserEntity>,@Body() verifyCredentials : VerifyCodeDto){
    return this.userService.verifyAccount(user,verifyCredentials)
  }

}
