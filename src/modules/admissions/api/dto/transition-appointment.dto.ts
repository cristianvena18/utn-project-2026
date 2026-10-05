import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { IsOptional } from 'class-validator';
import { AppointmentStatus, TriageLevel } from '../../domain/appointment';

export class TransitionAppointmentDto {
  @ApiProperty({ enum: AppointmentStatus })
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;

  @ApiPropertyOptional({ enum: TriageLevel })
  @IsOptional()
  @IsEnum(TriageLevel)
  triageLevel?: TriageLevel;
}
