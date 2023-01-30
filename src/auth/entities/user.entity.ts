import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, BeforeUpdate, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    email: string;

    @Column('text', {
        select: false
    })
    password:string;

    @Column('text')
    fullName: string;

    @Column('bool',{default: true})
    isActive: boolean;

    @Column('text',{
        array: true,
        default:['USER']
    })
    roles: string [];

    @OneToMany(
        () => Product, (product) => product.user
    )
    product: Product;

    @BeforeInsert()
    checkBeforeInsert(){
        this.email = this.email.toLocaleLowerCase().trim();
    }

    @BeforeUpdate()
    checkBeforeUpdate(){
        this.checkBeforeInsert();
    }

}
