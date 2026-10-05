import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';
import { IsEnum } from 'class-validator';
import { IsInt } from 'class-validator';
import { IsOptional } from 'class-validator';
import { IsString } from 'class-validator';
import { Min } from 'class-validator';
import { InsuranceType } from '../../domain/patient';

export class RegisterPatientDto {
  @ApiProperty()
  @IsString()
  nationalId: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: '1990-04-12' })
  @IsDateString()
  birthDate: string;

  @ApiProperty({ enum: InsuranceType })
  @IsEnum(InsuranceType)
  insuranceType: InsuranceType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  insuranceName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number;
}
