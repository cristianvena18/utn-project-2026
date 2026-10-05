import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  SEVERE_ALLERGY_RECORDED,
  SevereAllergyRecordedEvent,
} from '../../../shared/integration-events/severe-allergy-recorded.event';
import {
  PHARMACY_ALERT_REPOSITORY,
  type PharmacyAlertRepository,
} from '../domain/ports/resources.repository';

@Injectable()
export class SevereAllergyPharmacySubscriber {
  constructor(
    @Inject(PHARMACY_ALERT_REPOSITORY)
    private readonly alerts: PharmacyAlertRepository,
  ) {}

  @OnEvent(SEVERE_ALLERGY_RECORDED)
  handle(event: SevereAllergyRecordedEvent): Promise<void> {
    return this.alerts.add({
      patientId: event.patientId,
      substance: event.substance,
      message: `Do not dispense ${event.substance} to patient ${event.patientId}`,
    });
  }
}
