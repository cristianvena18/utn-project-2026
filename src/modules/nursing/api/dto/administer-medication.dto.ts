import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsString } from 'class-validator';

export class AdministerMedicationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
