import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./entity/user.entity";
import {Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import {SignUpDto} from "./dto/sign-up.dto";
import * as bcrypt from 'bcrypt';
import {LoginDto} from "./dto/login.dto";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepository : Repository<UserEntity>,
        private jwtService : JwtService
    ) {
    }

    async signUp(userData : SignUpDto){
        const user=this.userRepository.create(
            {
                ...userData
            }
        )
        user.salt= await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password,user.salt)
        try {
            await this.userRepository.save(user)
        }catch (e){
            throw new ConflictException("Un erreur lors de sign up")
        }
        return {
            id : user.id,
            email : user.email,
            role : user.role,
        }

    }

    async login(credentials : LoginDto){
        const {email, password} = credentials;
        const user = await this.userRepository.findOneBy([{email: email}])

        if (!user) {
            throw new NotFoundException(`l'email ou le mot de passe sont incorrecte`)
        }
        const hashedPassword = await bcrypt.hash(password, user.salt)
        if (hashedPassword == user.password) {
            const payload = {
                firstName : user.firstName,
                lastName : user.lastName,
                email: user.email,
                role: user.role,
                phoneNumber: user.phoneNumber,
                address : user.address
            }

            const token = await this.jwtService.sign(payload)

            return {
                "token": token
            }

        } else {
            throw new NotFoundException(`l'email ou le mot de passe sont incorrecte`)
        }

    }
}
