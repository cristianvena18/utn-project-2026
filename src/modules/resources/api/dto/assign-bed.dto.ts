import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { Min } from 'class-validator';

export class AssignBedDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  patientId: number;
}
