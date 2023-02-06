import {ConflictException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {BasketEntity} from "./entity/basket.entity";
import {UserEntity, UserRole} from "../user/entity/user.entity";
import {ProductOrderDto} from "../order/dto/product-order.dto";
import {ProductService} from "../product/product.service";
import {BasketProductEntity} from "./entity/basket-product.entity";


@Injectable()
export class BasketService {



    constructor(
        @InjectRepository(BasketEntity)
        private basketRepository: Repository<BasketEntity>,
        private productService: ProductService,
        @InjectRepository(BasketProductEntity)
        private basketProductRepository: Repository<BasketProductEntity>,
    ) {
    }


    async getBasket(user : Partial<UserEntity>) {
        if (user.role!=UserRole.client){
            throw new UnauthorizedException()
        }
        const basket = this.basketRepository.findOne({where : {user : user}, relations: ["basketProduct"]})
        if (!basket){
            throw new NotFoundException("Le panier n'exite pas")
        }
        return basket
    }

    async removeFromBasket(user : Partial<UserEntity>, productId : number){
        if (user.role !=UserRole.client){
            throw new UnauthorizedException()
        }
        const product = await this.productService.getProductById(productId)
        if (!product){
            throw new NotFoundException("le produit n'existe pas")
        }
        try {
            return this.basketProductRepository.delete({product: product , productBasket: user.basket})
        }catch (e){
            throw new ConflictException("Une erreur est survenue lors du supression du produit")
        }
    }


    async addToBasket(user: Partial<UserEntity>, productToBasket: ProductOrderDto) {
        if (user.role != UserRole.client) {
            throw new UnauthorizedException()
        }
        const product = await this.productService.getProductById(productToBasket.id)
        if (!product) {
            throw new NotFoundException("le produit n'existe pas")
        }
        if (productToBasket.itemsNumber > product.itemsNumber) {
            throw new ConflictException("La quantité restantes dans le stock n'est pas suffisantes")
        }
        const productBasketEntity = this.basketProductRepository.create({
            productBasket : user.basket,
            product : product,
            itemsNumber: productToBasket.itemsNumber
        })
        try {
            return await this.basketProductRepository.save(productBasketEntity)
        }catch (e){
            throw new ConflictException("Le produit n'est pas ajouté au panier , Veuillez réessayer !")
        }
    }


}
