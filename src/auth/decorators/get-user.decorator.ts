import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

export const  GetUser = createParamDecorator(
    (data, ctx: ExecutionContext) => {

        
        const req = ctx.switchToHttp().getRequest();
        let user = req.user;
        if(!user)
            throw new InternalServerErrorException('Usuario no encontrado en el requeest.')

        return !data ? user : user[data];
    }
);

