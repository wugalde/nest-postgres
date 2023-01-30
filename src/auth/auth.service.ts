import { Injectable, BadRequestException, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import  * as bcrypt from 'bcrypt'
import { JWTPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {




  
  private  logger = new Logger("AuthService");

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jtwService: JwtService
  ) {}
  async create(createUserDto: CreateUserDto) {
    try{
      const {password, ...userData } = createUserDto;
      const salt = bcrypt.genSaltSync(10);

      const user = this.userRepository.create({
          ...userData, 
          password: bcrypt.hashSync(password,salt)
      });
      await this.userRepository.save(user);
      delete user.password;
      return {
        ...user, 
        token: this.getJwtToken({id:user.id})
      };


      //TODO: retornar el JWT
    }catch(error) {
      this.handleError(error);
    }
  }


  
  async login(loginUserDto: LoginUserDto) {
   
    const {email, password } = loginUserDto;

    const user: any = await this.userRepository.findOne({
      where:{email}, 
      select: {
          id: true,
          isActive:true,
          email: true, 
          password: true
      }
    });
    
    if(!user)
      throw new UnauthorizedException('Credenciales invalidas');
    if(!user.isActive)
      throw new UnauthorizedException('Usuario  inactivo');

     if(!bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException('Credenciales invalidas');
    delete user.password    
    return {
            ...user, 
            token: this.getJwtToken({id:user.id})
    };

  }


    
  refreshToken(user: User) {
    return {
      ...user, 
      token: this.getJwtToken({id:user.id})
    };
  }
  

  private getJwtToken(paylod: JWTPayload){
      const token = this.jtwService.sign(paylod);
      return token;
  }





  private handleError(error: any): never {
    if(error.code === '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Revisar los logs del servidor')
  }
}
