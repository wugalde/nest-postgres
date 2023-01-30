import { User } from '../../auth/entities/user.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './product-image.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({name: 'products'})
export class Product {

    @ApiProperty({
        example: "304ba180-20fe-4ebb-9746-a19b37ff2877",
        description: 'Id del producto',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: "T-Shirt Teslo",
        description: 'Nombre del producto',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Precio del producto',
    })
    @Column('float',{
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'T-shirt para ir a la oficina',
        description: 'Descrpcion del producto',
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: 't_shirt_001',
        description: 'key para buscar el producfto',
        uniqueItems: true
    })
    @Column({
        type: 'text',
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 0,
        description: 'Cantidad del producto en bodega',
    })
    @Column('numeric',{
        default:0
    })
    stok: number;

    @ApiProperty({
        example: ['M', 'L', 'X'],
        description: 'Tamagno del producto',
    })
    @Column('text',{
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: ['F'],
        description: 'Prenda para el sexo',
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        example: ['s1', 't1'],
        description: 'Tag para identificar el producto',
    })
    @Column('text',{
        array: true,
        default:[]
    })
    tags: string [];

    @ApiProperty({
        example: ['img.png', 'img.png'],
        description: 'Imagenes del producto',
    })
    @OneToMany(
        ()=> ProductImage, 
        (productImage) => productImage.product,
        {cascade: true, eager: true}
    )
    images?: ProductImage[];

    @ManyToOne(
        ()=> User, 
        (user) => user.product,
        {eager: true}
    )
    user: User;
    

    @BeforeInsert()
    checkSlugInsert(){
        if(!this.slug)
            this.slug = this.title;
            this.changeSlug();
    }

    @BeforeUpdate()
    checkslugUpdate(){
        if(this.slug){
            this.changeSlug();
        }
    }

    private changeSlug(){
        this.slug = this.slug.toLocaleLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'",'');
    }
}
