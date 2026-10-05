import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { IsOptional } from 'class-validator';
import { Min } from 'class-validator';

export class DeductSupplyDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  patientId?: number;
}
