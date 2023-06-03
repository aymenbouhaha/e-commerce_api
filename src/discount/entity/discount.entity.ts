import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
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

    @OneToOne(
        type => ProductEntity,
        product=>product.discount,
    )
    product : ProductEntity
}
