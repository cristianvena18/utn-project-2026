import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { IsEnum } from 'class-validator';
import { IsOptional } from 'class-validator';
import { AdmissionType } from '../../domain/care-protocol.builder';

export class BuildProtocolDto {
  @ApiProperty({ enum: AdmissionType })
  @IsEnum(AdmissionType)
  admissionType: AdmissionType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  withMedicationMonitoring?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  withAllergyPrecautions?: boolean;
}
