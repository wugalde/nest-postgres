import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, Delete } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validate as isUUID} from 'uuid'
import { ProductImage, Product} from './entities';
@Injectable()
export class ProductsService {

  private  readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product) private readonly productRepoitory: Repository<Product>,
    @InjectRepository(ProductImage) private readonly productImageRepoitory: Repository<ProductImage>,
    private readonly dataSource: DataSource
  ){}

  async create(createProductDto: CreateProductDto) {
    try{
      
      const {images = [], ... productDetails} =  createProductDto;

       const product=  this.productRepoitory.create(
        {
          ...productDetails, 
          images: images.map( image => this.productImageRepoitory.create({url: image}))
        });

       await this.productRepoitory.save(product);
       
       return {...product, images};

    }catch(error){
      this.handleDBException(error);
    }

  }

  //TODO: Paginar
  async findAll(paginationDto: PaginationDto) {
    const {limit = 10, offset=0 } = paginationDto;
    const products = await this.productRepoitory.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    });

    return products.map(({images, ...rest}) => ({
      ...rest, 
      images: images.map( img => img.url)
    }));
  }

  async findOne(term: string) {
    let product: Product;

    if(isUUID(term)){
      product =  await this.productRepoitory.findOneBy({id:term});
    }else {
      const queryBuilder = this.productRepoitory.createQueryBuilder('aliasProducto');
      product = await  queryBuilder.where('UPPER(title) =:title or slug =:slug', {
        title: term.toUpperCase(),
        slug: term.toLowerCase()
      })
      .leftJoinAndSelect('aliasProducto.images','aliasJoin')
      .getOne()
    }

    if(!product)
      throw new NotFoundException(`El producto [ ${term} ] requerido no fue encontrado.`)
  
      
    return product
  }

  async findOnePlain(term: string){
    const {images = [], ...rest } = await this.findOne(term);
    return {
      ... rest,
      images: images.map( image => image.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    
    const {images, ...toUpate} = updateProductDto;




    const product = await this.productRepoitory.preload({id, ...toUpate});


    if(!product)
      throw new NotFoundException(`El producto con el id ${id} no existe`);


      //Transacciones.
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try{
        if(images){ 
          // Se borran la ya existenes
          await queryRunner.manager.delete(ProductImage, {product: {id}});
          product.images = images.map( image => this.productImageRepoitory.create({url: image}));
        }else{

        }
        await queryRunner.manager.save(product)
        await queryRunner.commitTransaction()
        await queryRunner.release();

        return this.findOnePlain(id);
      }catch(error){
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        this.handleDBException(error)
      }



    // try{ 
    //   // return await this.productRepoitory.save(product);
    // }catch(error){
    //   this.handleDBException(error)
    // }
  }

  async remove(id: string){
    const product = await this.findOne(id);
    return await  this.productRepoitory.remove(product);
  }


  private handleDBException(error: any){
    if(error.code === '23505')
      throw new BadRequestException(error.detail);
    
      this.logger.error(error);
      throw new InternalServerErrorException('Error no esperado, por favor revisar los logs del server')
  }


  async delAllProducts(){
    const query = this.productRepoitory.createQueryBuilder('product');
    try{
      return await query.delete().where({}).execute();
    }catch(error){
      this.handleDBException(error)
    }
  }

}
