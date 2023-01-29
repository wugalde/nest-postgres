import { Type } from 'class-transformer';
import { isNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @Type(() => Number) // Congiracion global como el enableImplicitConvertion: true
    limit?: number;


    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number;
}