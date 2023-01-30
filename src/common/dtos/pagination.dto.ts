import { Type } from 'class-transformer';
import { isNumber, IsOptional, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class PaginationDto {

    @ApiProperty({
        default: 10, description: 'Cuanto items retorna'
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number) // Congiracion global como el enableImplicitConvertion: true
    limit?: number;


    @ApiProperty({
        default: 0, description: 'Cuanto items se salta'
    })
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number;
}