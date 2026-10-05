import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  BED_ASSIGNED,
  BedAssignedEvent,
} from '../../../shared/integration-events/bed-assigned.event';
import { RegisterChargeUseCase } from '../application/register-charge.use-case';

@Injectable()
export class BedAssignedBillingSubscriber {
  constructor(private readonly registerCharge: RegisterChargeUseCase) {}

  @OnEvent(BED_ASSIGNED)
  handle(event: BedAssignedEvent): Promise<void> {
    return this.registerCharge.execute({
      patientId: event.patientId,
      concept: 'Inpatient stay / bed',
      baseAmount: 25000,
      sourceType: 'bed',
      sourceId: event.bedId,
    });
  }
}
