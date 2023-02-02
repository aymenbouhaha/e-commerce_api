import {Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn,JoinTable} from "typeorm";
import {UserEntity} from "../../user/entity/user.entity";
import {ProductEntity} from "../../product/entity/product.entity";


export enum OrderState {
    pending = 'En Cours',
    delivred = 'Delivré',
    canceled = 'Annulé'
}

@Entity("order")
export class OrderEntity {


    @PrimaryGeneratedColumn()
    id : number

    @Column(
        {
            type : "enum",
            enum : OrderState,
            default : OrderState.pending
        }
    )
    status : string

    @CreateDateColumn()
    date : Date

    @ManyToOne(
        type => UserEntity,
        {
            onDelete : 'CASCADE',
            onUpdate : 'CASCADE'
        }
    )
    client : UserEntity

    @ManyToMany(
        type => ProductEntity,
        {
            onDelete : 'CASCADE',
            onUpdate : 'CASCADE'
        }
    )
    @JoinTable({
        name : 'order_product',
        joinColumn : {
            name : "order_id",
            referencedColumnName : 'id'
        },
        inverseJoinColumn: {
            name : 'product_id',
            referencedColumnName : 'id'
        },
    })
    product : ProductEntity[]

}
