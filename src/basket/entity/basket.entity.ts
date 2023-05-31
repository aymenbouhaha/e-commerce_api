import { Entity, PrimaryGeneratedColumn, OneToOne, OneToMany } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { BasketProductEntity } from './basket-product.entity';

@Entity('basket')
export class BasketEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => UserEntity, (user) => user.basket)
  user: UserEntity;

  @OneToMany(
    (type) => BasketProductEntity,
    (basketProduct) => basketProduct.productBasket,
  )
  basketProduct: BasketProductEntity[];
}
