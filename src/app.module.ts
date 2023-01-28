import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EnvConfiguration } from './config/env.config';
import { JoivalidationSchema } from './config/joi.validation';

@Module({
  imports: [
    // Configuracion para validar variables de ambiente.
    ConfigModule.forRoot({
      load:[EnvConfiguration],
      validationSchema: JoivalidationSchema,
    }), //

    ServeStaticModule.forRoot({rootPath: join(__dirname,'..','public'), }) // Configuracion para habilidar sitio estatico.
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
