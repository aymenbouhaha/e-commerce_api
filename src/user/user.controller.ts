import {Body, Controller, Post} from '@nestjs/common';
import { UserService } from './user.service';
import {SignUpDto} from "./dto/sign-up.dto";
import {LoginDto} from "./dto/login.dto";

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

}
