import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {DiscountEntity} from "./entity/discount.entity";
import {Repository} from "typeorm";
import {UserEntity, UserRole} from "../user/entity/user.entity";
import {AddDiscountDto} from "./dto/add-discount.dto";
import {ProductService} from "../product/product.service";
import {GetProductDto} from "../common/get-product.dto";

@Injectable()
export class DiscountService {

    constructor(
        @InjectRepository(DiscountEntity)
        private discountRepository : Repository<DiscountEntity>,
        private productService : ProductService
    ) {
    }


    async addDiscount(user: Partial<UserEntity>, newDiscount: AddDiscountDto) {
        if (user.role != UserRole.admin) {
            throw new UnauthorizedException()
        }
        const product = await this.productService.getProductById(newDiscount.productId)
        if (!product) {
            throw new NotFoundException()
        }
        if(product.discount){
            throw new BadRequestException("Le Produit est deja en promotion")
        }
        const discount = this.discountRepository.create({
            value: newDiscount.value,
            endDate: newDiscount.endDate,
            product: product,
            startDate : newDiscount.startDate
        })
        try {
            const discountCreated = await this.discountRepository.save(discount)
            const startDate =new Date(discountCreated.startDate)
            const endDate =new Date(discountCreated.endDate)
            const delay = endDate.getTime()-startDate.getTime()
            setTimeout(
                async () => {
                    await this.discountRepository.delete(discountCreated.id)
                },delay
            )
            return discountCreated
        }catch (e){
            throw new ConflictException("Un probleme est survenue lors de l'ajout du promotion")
        }
    }


    async getDiscounts(paginationOptions : GetProductDto){
        let skip= null;
        let take = 15;
        if (paginationOptions.page){
            skip = (paginationOptions.page -1)*take
        }
        return await this.discountRepository.find({relations : ["product"], take : take , skip : skip})
    }


    async removeDiscount(user: Partial<UserEntity>, discountId: number) {
        if (user.role != UserRole.admin) {
            throw new UnauthorizedException()
        }
        return await this.discountRepository.delete(discountId)
    }

}
