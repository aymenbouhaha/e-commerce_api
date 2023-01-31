import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

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


}
