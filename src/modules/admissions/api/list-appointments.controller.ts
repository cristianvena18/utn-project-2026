import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '../../iam/domain/role';
import { Roles } from '../../iam/api/roles.decorator';
import { ListAppointmentsUseCase } from '../application/list-appointments.use-case';

@ApiTags('admissions')
@ApiBearerAuth()
@Controller()
export class ListAppointmentsController {
  constructor(private readonly listAppointments: ListAppointmentsUseCase) {}

  @Get('appointments')
  @Roles(Role.ADMINISTRATOR, Role.RECEPTIONIST, Role.DOCTOR, Role.NURSE)
  @ApiOperation({ summary: 'Appointment schedule' })
  list() {
    return this.listAppointments.execute();
  }
}
