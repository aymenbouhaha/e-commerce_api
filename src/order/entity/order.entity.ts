import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';

import { OrderProductEntity } from './order-product.entity';

export enum OrderState {
  pending = 'En Cours',
  delivred = 'Delivré',
  canceled = 'Annulé',
}

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: OrderState,
    default: OrderState.pending,
  })
  status: string;

  @CreateDateColumn()
  date: Date;

  @ManyToOne((type) => UserEntity, {
    onDelete: 'CASCADE',
  })
  client: UserEntity;

  @OneToMany(
    (type) => OrderProductEntity,
    (orderProduct) => orderProduct.order,
    {
      cascade: ['insert', 'remove'],
    },
  )
  orderProducts: OrderProductEntity[];
}
