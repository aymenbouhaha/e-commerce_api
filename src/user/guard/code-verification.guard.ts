import {BadRequestException, CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import { Observable } from 'rxjs';
import {UserEntity} from "../entity/user.entity";

@Injectable()
export class CodeVerificationGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user : Partial<UserEntity>= request["user"]
    if (!user.verified){
      throw new BadRequestException("Le compte n'est pas verifié");
    }
    return user.verified
  }
}
