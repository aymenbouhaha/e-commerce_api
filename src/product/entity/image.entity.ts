import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ProductEntity} from "./product.entity";

@Entity("image")
export class ImageEntity {

    @PrimaryGeneratedColumn()
    id : number

    @Column()
    name: string;

    @Column()
    type: string;

    @Column({ type: 'longblob' })
    data: Buffer;


    @ManyToOne(
        type => ProductEntity,
        product=>product.images,
        {
            onDelete : 'CASCADE',
            onUpdate : 'CASCADE',
        }
    )
    product : ProductEntity
}
