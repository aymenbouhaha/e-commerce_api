import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {PayloadInterface} from "../interface/payload.interface";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../entity/user.entity";
import {Repository} from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private config : ConfigService,
        @InjectRepository(UserEntity)
        private userRepository : Repository<UserEntity>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('SECRET'),
        });
    }

    async validate(payload: PayloadInterface) {
        const user = await this.userRepository.findOne({where : {email : payload.email} , relations: ["basket"]})
        if (!user) {
            throw new UnauthorizedException()
        }else {
            const { password , salt , ...result}=user
            return result;
        }

    }
}