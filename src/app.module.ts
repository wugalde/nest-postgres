import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


import { EnvConfiguration } from './config/env.config';
import { JoivalidationSchema } from './config/joi.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    // Configuracion para validar variables de ambiente.
    ConfigModule.forRoot({
      load:[EnvConfiguration],
      validationSchema: JoivalidationSchema,
    }), //


    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DBPG_PORT,
      database: process.env.DBPG_NAME,
      username: process.env.DBPG_USER,
      password: process.env.DBPG_PWD,
      autoLoadEntities: true,
      synchronize: true
    }),

    ServeStaticModule.forRoot({rootPath: join(__dirname,'..','public'), }) ,// Configuracion para habilidar sitio estatico.
    
    ProductsModule, CommonModule, SeedModule, FilesModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule {

  constructor(){
    // console.log('process.env.DB_PORT:',process.env.DBPG_PORT)
  }
}
