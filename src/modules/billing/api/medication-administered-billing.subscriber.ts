import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  MEDICATION_ADMINISTERED,
  MedicationAdministeredEvent,
} from '../../../shared/integration-events/medication-administered.event';
import { RegisterChargeUseCase } from '../application/register-charge.use-case';

@Injectable()
export class MedicationAdministeredBillingSubscriber {
  constructor(private readonly registerCharge: RegisterChargeUseCase) {}

  @OnEvent(MEDICATION_ADMINISTERED)
  handle(event: MedicationAdministeredEvent): Promise<void> {
    return this.registerCharge.execute({
      patientId: event.patientId,
      concept: 'Medication',
      baseAmount: 3500,
      sourceType: 'medication',
      sourceId: event.administrationId,
    });
  }
}
