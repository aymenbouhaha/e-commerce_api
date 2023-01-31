import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {CategoryEntity} from "../../category/entity/category.entity";
import {ImageEntity} from "./image.entity";
import {DiscountEntity} from "../../discount/entity/discount.entity";

@Entity("product")
export class ProductEntity {


    @PrimaryGeneratedColumn()
    id : number

    @Column()
    name : string

    @Column(
        {
            type : "float"
        }
    )
    price : number

    @Column()
    itemsNumber : number


    @ManyToOne(
        type => CategoryEntity,
        {
            onDelete : 'CASCADE',
            onUpdate : 'CASCADE'
        }
    )
    category : CategoryEntity

    @OneToMany(
        type => ImageEntity,
        image=>image.product,
        {
            onDelete : 'CASCADE',
            onUpdate : 'CASCADE'
        }
    )
    images : ImageEntity[]


    @OneToMany(
        type => DiscountEntity,
        discount=>discount.product,
        {
            onDelete : 'CASCADE',
            onUpdate : 'CASCADE'
        }
    )
    discount : DiscountEntity[]

}
