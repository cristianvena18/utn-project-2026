import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';
import { IsInt } from 'class-validator';
import { Min } from 'class-validator';

export class BookAppointmentDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  patientId: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  doctorId: number;

  @ApiProperty({ example: '2026-10-01T10:00:00.000Z' })
  @IsDateString()
  scheduledAt: string;
}
