import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed';
import { Repository } from 'typeorm';
import  * as bcrypt from 'bcrypt'


@Injectable()
export class SeedService {

constructor(
  @InjectRepository(User)
  private readonly userRepository: Repository<User>,
  private readonly productService: ProductsService
  ){
  
}
  async runSeed() {
    this.purgeAllTables();
    const useri = await this.insertUsers(); 
    this.insertNewsProductos(useri);
    return `runSeed`;
  }


  private async purgeAllTables(){
    await this.productService.delAllProducts();
    const qb = this.userRepository.createQueryBuilder()
    await qb.delete().where({}).execute()
  }

  private async insertUsers() {
    const salt = bcrypt.genSaltSync(10);
    const users  =  initialData.users;
    const usersP: User[] = [];
    users.forEach(u => {
      u.password = bcrypt.hashSync(u.password,salt)
      usersP.push(this.userRepository.create(u));
    })
   const dbu = await this.userRepository.save(usersP);
    return dbu[0];
  }


  private async insertNewsProductos(user: User) {
    await this.productService.delAllProducts();

    const produts = initialData.products;

    const insersPromise = [];
    produts.forEach( p => {
      insersPromise.push(this.productService.create(p, user)) ;
    })

    Promise.all(insersPromise);

    return true;
  }
}
