import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";

import {BasketEntity} from "../../basket/entity/basket.entity";

export enum UserRole {
    admin = 'admin',
    client = 'client',
}

@Entity("user")
export class UserEntity {

    @PrimaryGeneratedColumn()
    id : number

    @Column({
        nullable: false,
    })
    firstName : string

    @Column({
        nullable: false,
    })
    lastName : string

    @Column({
        nullable: false,
    })
    address : string

    @Column({
        nullable: false,
        unique : true
    })
    email : string

    @Column({
        nullable: false,
    })
    phoneNumber : string

    @Column({
        nullable: false,
    })
    password : string

    @Column({
        nullable: false,
    })
    salt : string

    @Column({
        type : "enum",
        enum : UserRole,
        default : UserRole.client,
    })
    role : string


    // @ManyToMany(
    //     type => ProductEntity,
    //     product=>product.basketUser
    // )
    // @JoinTable({
    //     name : "basket",
    //     joinColumn : {
    //         name : "userId",
    //         referencedColumnName: "id"
    //     },
    //     inverseJoinColumn:{
    //         name : "productId",
    //         referencedColumnName : "id"
    //     },
    //     synchronize : true
    //     }
    // )
    // basketProducts : ProductEntity[]

    @OneToOne(
        type => BasketEntity,
        {
            cascade : true
        }
    )
    @JoinColumn()
    basket : BasketEntity

}
