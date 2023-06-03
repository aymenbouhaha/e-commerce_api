import {
    ConflictException,
    GatewayTimeoutException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./entity/user.entity";
import {Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import {SignUpDto} from "./dto/sign-up.dto";
import * as bcrypt from 'bcrypt';
import {LoginDto} from "./dto/login.dto";
import {BasketEntity} from "../basket/entity/basket.entity";
import {MailService} from "./mail/mail.service";
import {VerifyCodeDto} from "./dto/verify-code.dto";
import {UpdateUserDto} from "./dto/update-user.dto";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepository : Repository<UserEntity>,
        private jwtService : JwtService,
        private mailService: MailService
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
        const verifCode = Math.floor(1000+ Math.random()*9000).toString()
        user.verificationCode=verifCode
        user.basket=new BasketEntity()
        try {
            await this.userRepository.save(user)
        }catch (e){
            throw new ConflictException("Une erreur est survenue veuillez réessayer")
        }
        try {
            this.mailService.sendVerificationCode(user.email,user.verificationCode)
        }catch (e) {
            throw new GatewayTimeoutException("Email was not sent")
        }
        return {
            id : user.id,
            email : user.email,
            role : user.role,
        }

    }

    async verifyAccount(couple : Partial<UserEntity>,verifyCode: VerifyCodeDto) {
        if (couple.verified){
            return {
                "verified" : true
            }
        }else {
            if (verifyCode.code==couple.verificationCode){
                try {
                    await this.userRepository.update(couple.id,{verified : true})
                }catch (e) {
                    throw new HttpException("Une erreur est survenue veuillez réesseayer", HttpStatus.AMBIGUOUS)
                }
                return {
                    "verified" : true
                }
            }else {
                throw new HttpException("Le code n'est pas correcte", HttpStatus.BAD_REQUEST)
            }
        }
    }

    async login(credentials : LoginDto){
        const {email, password} = credentials;
        const user = await this.userRepository.findOne({where : {email : email} , relations : ["basket"]})

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
        ...payload,
          basket: user.basket,
        token: token,
      };
    } else {
      throw new NotFoundException(`l'email ou le mot de passe sont incorrecte`);
    }
  }

  update(user : Partial<UserEntity>, userData: UpdateUserDto) {

    return this.userRepository.update(user.id,userData);
  }
}
