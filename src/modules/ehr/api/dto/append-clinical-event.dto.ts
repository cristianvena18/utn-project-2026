import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { IsObject } from 'class-validator';
import { IsOptional } from 'class-validator';
import { IsString } from 'class-validator';
import {
  AllergySeverity,
  ClinicalEventType,
} from '../../domain/clinical-event';

export class AppendClinicalEventDto {
  @ApiProperty({ enum: ClinicalEventType })
  @IsEnum(ClinicalEventType)
  type: ClinicalEventType;

  @ApiProperty({
    example: { substance: 'Penicilina', severity: 'SEVERE' },
  })
  @IsObject()
  payload: Record<string, unknown>;

  @ApiPropertyOptional({ enum: AllergySeverity })
  @IsOptional()
  @IsEnum(AllergySeverity)
  severity?: AllergySeverity;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  substance?: string;
}
