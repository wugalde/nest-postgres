import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { JWTPayload } from "../interfaces/jwt-payload.interface";
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService

    ){
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: JWTPayload):Promise<User>{
        const {id} =payload;

        const user = await this.userRepository.findOneBy({id});

        if(!user)
            throw new UnauthorizedException('Token invialido');

        if(!user.isActive)
            throw new UnauthorizedException('Usuario inactivo, favor comunicarse con el administrador.');
        
        console.log(user)

        return user;
    }
}