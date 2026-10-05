import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  APPOINTMENT_ATTENDED,
  AppointmentAttendedEvent,
} from '../../../shared/integration-events/appointment-attended.event';
import { RegisterChargeUseCase } from '../application/register-charge.use-case';

@Injectable()
export class AppointmentAttendedBillingSubscriber {
  constructor(private readonly registerCharge: RegisterChargeUseCase) {}

  @OnEvent(APPOINTMENT_ATTENDED)
  handle(event: AppointmentAttendedEvent): Promise<void> {
    return this.registerCharge.execute({
      patientId: event.patientId,
      concept: 'Medical consultation',
      baseAmount: 10000,
      sourceType: 'appointment',
      sourceId: event.appointmentId,
    });
  }
}
