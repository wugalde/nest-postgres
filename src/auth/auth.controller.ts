import { Controller, Get, Post, Body, Headers, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { IncomingHttpHeaders } from 'http';
import { AuthService } from './auth.service';
import { Auth } from './decorators';
import { GetHeaders } from './decorators/get-headers.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { RoleProtected } from './decorators/role-protected.decorator';
import { LoginUserDto, CreateUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }


  @Get('security-test1')
  @UseGuards( AuthGuard() )
  testingPrivateRouter(
    @GetUser() user: User,
    @GetUser('email') params: string,
    @GetHeaders() headers: string[],
    @Headers() iheaders: IncomingHttpHeaders
  ){
    return {
      user,
      ok: true,
      mensaje: 'Ruta privada',
      email: params,
      headers,
      iheaders
    }
  }



  @Get('security-test2')
  // @SetMetadata('roles',['ADMIN', 'SUPER_USER'])
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards( AuthGuard(), UserRoleGuard )
  testingPrivate2Router(
    @GetUser() user: User,
  ){
    return {
      ok: true,
      mensaje: 'Ruta privada',
      user
    }
  }

  @Get('security-test3')
  @Auth(ValidRoles.user)
  testingPrivate3Router(
    @GetUser() user: User,
  ){
    return {
      ok: true,
      mensaje: 'Ruta privada',
      user
    }
  }


  @Get('refresh-token')
  @Auth()
  refreshToken(
    @GetUser() user: User
  ){
    return this.authService.refreshToken(user);
  }
}

