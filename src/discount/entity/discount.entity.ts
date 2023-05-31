import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ProductEntity} from "../../product/entity/product.entity";

@Entity("discount")
export class DiscountEntity {

    @PrimaryGeneratedColumn()
    id : number

    @Column()
    startDate : Date

    @Column()
    endDate : Date

    @Column()
    value : number

    @ManyToOne(
        type => ProductEntity,
        product=>product.discount,
        {
            onDelete : 'CASCADE',
            onUpdate : 'CASCADE'
        }
    )
    product : ProductEntity
}
