import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '../../iam/domain/role';
import { Roles } from '../../iam/api/roles.decorator';
import { TransitionAppointmentUseCase } from '../application/transition-appointment.use-case';
import { TransitionAppointmentDto } from './dto/transition-appointment.dto';

@ApiTags('admissions')
@ApiBearerAuth()
@Controller()
export class TransitionAppointmentController {
  constructor(
    private readonly transitionAppointment: TransitionAppointmentUseCase,
  ) {}

  @Post('appointments/:id/transition')
  @Roles(Role.ADMINISTRATOR, Role.RECEPTIONIST, Role.DOCTOR, Role.NURSE)
  @ApiOperation({ summary: 'Change appointment status or triage' })
  transition(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: TransitionAppointmentDto,
  ) {
    return this.transitionAppointment.execute(id, dto.status, dto.triageLevel);
  }
}
