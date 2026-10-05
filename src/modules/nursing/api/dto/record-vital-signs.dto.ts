import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { IsNumber } from 'class-validator';
import { Max } from 'class-validator';
import { Min } from 'class-validator';

export class RecordVitalSignsDto {
  @ApiProperty()
  @IsInt()
  @Min(50)
  @Max(250)
  systolic: number;

  @ApiProperty()
  @IsInt()
  @Min(30)
  @Max(150)
  diastolic: number;

  @ApiProperty()
  @IsInt()
  @Min(30)
  @Max(220)
  heartRate: number;

  @ApiProperty()
  @IsNumber()
  @Min(30)
  @Max(45)
  temperature: number;

  @ApiProperty()
  @IsInt()
  @Min(50)
  @Max(100)
  spo2: number;
}
