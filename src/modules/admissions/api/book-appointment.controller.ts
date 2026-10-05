import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '../../iam/domain/role';
import { Roles } from '../../iam/api/roles.decorator';
import { BookAppointmentUseCase } from '../application/book-appointment.use-case';
import { BookAppointmentDto } from './dto/book-appointment.dto';

@ApiTags('admissions')
@ApiBearerAuth()
@Controller()
export class BookAppointmentController {
  constructor(private readonly bookAppointment: BookAppointmentUseCase) {}

  @Post('appointments')
  @Roles(Role.ADMINISTRATOR, Role.RECEPTIONIST, Role.PATIENT)
  @ApiOperation({ summary: 'Book appointment' })
  book(@Body() dto: BookAppointmentDto) {
    return this.bookAppointment.execute(dto);
  }
}
