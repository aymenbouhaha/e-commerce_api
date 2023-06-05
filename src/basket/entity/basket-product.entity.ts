import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BasketEntity } from './basket.entity';
import { ProductEntity } from '../../product/entity/product.entity';

@Entity('basket_product')
export class BasketProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => BasketEntity, (basket) => basket.basketProduct)
  productBasket: BasketEntity;

  @ManyToOne((type) => ProductEntity )
  product: ProductEntity;

  @Column()
  itemsNumber: number;
}
