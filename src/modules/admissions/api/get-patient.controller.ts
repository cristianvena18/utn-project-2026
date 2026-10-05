import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '../../iam/domain/role';
import { Roles } from '../../iam/api/roles.decorator';
import { GetPatientUseCase } from '../application/get-patient.use-case';

@ApiTags('admissions')
@ApiBearerAuth()
@Controller()
export class GetPatientController {
  constructor(private readonly getPatient: GetPatientUseCase) {}

  @Get('patients/:id')
  @Roles(
    Role.ADMINISTRATOR,
    Role.RECEPTIONIST,
    Role.DOCTOR,
    Role.NURSE,
    Role.PATIENT,
  )
  @ApiOperation({ summary: 'Get patient' })
  get(@Param('id', ParseIntPipe) id: number) {
    return this.getPatient.execute(id);
  }
}
