import { CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role-protected.decorator';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ){} 


  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler())
    if(!validRoles || validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    let user = req.user as User;
    if(!user)
      throw new InternalServerErrorException('Usuario no encontrado en el requeest.')

    for(const role of user.roles){
      if(validRoles.includes(role))
        return true;
    }
    throw new ForbiddenException(
      `
        El usuario no cuenta con los privilegios para ejecutar la funcionalidad.
        Roles validos [${validRoles}] 
      `)
    // console.log('User role gard', validRoles, user.roles)
  }
}
