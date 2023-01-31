import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ProductEntity} from "./product.entity";

@Entity("image")
export class ImageEntity {

    @PrimaryGeneratedColumn()
    id : number

    @Column()
    src : string


    @ManyToOne(
        type => ProductEntity,
        product=>product.images,
        {
            onDelete : 'CASCADE',
            onUpdate : 'CASCADE'
        }
    )
    product : ProductEntity
}
