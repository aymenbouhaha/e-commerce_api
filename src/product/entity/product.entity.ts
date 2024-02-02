import {
  Check,
  Column,
  Entity, JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryEntity } from '../../category/entity/category.entity';
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

  @Column({
    type : "simple-array"
  })
  images: string[];

  @OneToOne((type) => DiscountEntity, (discount) => discount.product,
      {
        eager : true,
        onDelete :"SET NULL"
      })
  @JoinColumn()
  discount: DiscountEntity;
}
