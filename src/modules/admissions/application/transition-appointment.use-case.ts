import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InvalidTransitionException } from '../../../shared/exceptions/invalid-transition.exception';
import { ResourceNotFoundException } from '../../../shared/exceptions/resource-not-found.exception';
import {
  APPOINTMENT_ATTENDED,
  AppointmentAttendedEvent,
} from '../../../shared/integration-events/appointment-attended.event';
import {
  AppointmentStateMachine,
  AppointmentStatus,
  TriageLevel,
} from '../domain/appointment';
import {
  APPOINTMENT_REPOSITORY,
  type AppointmentRepository,
} from '../domain/ports/appointment.repository';

@Injectable()
export class TransitionAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointments: AppointmentRepository,
    private readonly machine: AppointmentStateMachine,
    private readonly events: EventEmitter2,
  ) {}

  async execute(id: number, to: AppointmentStatus, triageLevel?: TriageLevel) {
    const appointment = await this.appointments.findById(id);
    if (!appointment) {
      throw new ResourceNotFoundException('Appointment', id);
    }
    if (!this.machine.canTransition(appointment.status, to)) {
      throw new InvalidTransitionException(appointment.status, to);
    }
    const updated = await this.appointments.updateStatus(
      appointment,
      to,
      triageLevel,
    );
    if (to === AppointmentStatus.ATTENDED) {
      this.events.emit(
        APPOINTMENT_ATTENDED,
        new AppointmentAttendedEvent(updated.id, updated.patientId),
      );
    }
    return updated;
  }
}
