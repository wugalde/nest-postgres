import { UploadedFile, UseInterceptors, BadRequestException, Get, Param, Res } from '@nestjs/common';
import { Controller, Post } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter } from './helpers/file-filter.helper';
import { fileName } from './helpers/file-name.helper';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Uploads')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
    ) {}


  @Get('product/:image')
  findProductImg(
    @Res() res: Response, 
    @Param('image') image: string
    ){
    const path = this.filesService.getProductImage(image);
    
    res.sendFile(path)
      // res.status(403).json({
      //   ok: false,
      //   path:path
      // })

  }


  @Post('upload')
  @UseInterceptors(FileInterceptor('file',
   {
    fileFilter: fileFilter,
    // limits: 1000
    storage: diskStorage({
      destination: './static/products',
      filename: fileName
    })
    })
  )
  fileUpload(@UploadedFile() file: Express.Multer.File){
    
    if (!file)
      throw new BadRequestException('El archivo es requerido');
      
    const secureUrl = `${this.configService.get('hots_api')}:${this.configService.get('port')}/api/v1/files/product/${ file.filename }`;
    return {
      secureUrl
    }
  }
}
