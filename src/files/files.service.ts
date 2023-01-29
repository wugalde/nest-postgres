import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  getProductImage(image: string){
    const path = join( __dirname, '../../static/products', image);
    if(!existsSync(path)){
        throw new BadRequestException(`No se encontro una imagen con el nombre ${image}`)
    }
    return path;
  }
}
