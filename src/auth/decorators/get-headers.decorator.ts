import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

export const  GetHeaders = createParamDecorator(
    (data, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest();
        return req.rawHeaders;
    }
);

