import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import {
  APPOINTMENT_REPOSITORY,
  type AppointmentRepository,
} from '../domain/ports/appointment.repository';

@Injectable()
export class ListAppointmentsUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointments: AppointmentRepository,
  ) {}

  execute() {
    return this.appointments.list();
  }
}
