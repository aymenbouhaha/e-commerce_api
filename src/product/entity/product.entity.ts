import {
  Check,
  Column,
  Entity, JoinColumn,
  ManyToOne,
  OneToMany, OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryEntity } from '../../category/entity/category.entity';
import { ImageEntity } from './image.entity';
import { DiscountEntity } from '../../discount/entity/discount.entity';

@Entity('product')
@Check(`"itemsNumber" >= 0`)
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'float',
  })
  price: number;

  @Column()
  itemsNumber: number;

  @Column()
  description : string

  @ManyToOne((type) => CategoryEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager : true
  })
  category: CategoryEntity;

  @OneToMany((type) => ImageEntity, (image) => image.product, {
    cascade: ['insert'],
    eager : true
  })
  images: ImageEntity[];

  @OneToOne((type) => DiscountEntity, (discount) => discount.product,
      {
        eager : true,
        onDelete :"SET NULL"
      })
  @JoinColumn()
  discount: DiscountEntity;
}
