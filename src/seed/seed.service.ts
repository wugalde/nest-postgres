import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed';

@Injectable()
export class SeedService {

constructor(private readonly productService: ProductsService){
  
}
  async runSeed() {
    this.insertNewsProductos();
    return `runSeed`;
  }


  private async insertNewsProductos() {
    await this.productService.delAllProducts();

    const produts = initialData.products;

    const insersPromise = [];
    produts.forEach( p => {
      insersPromise.push(this.productService.create(p)) ;
    })

    Promise.all(insersPromise);

    return true;
  }
}
