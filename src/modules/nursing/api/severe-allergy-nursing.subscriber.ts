import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  SEVERE_ALLERGY_RECORDED,
  SevereAllergyRecordedEvent,
} from '../../../shared/integration-events/severe-allergy-recorded.event';
import {
  NURSING_REPOSITORY,
  type NursingRepository,
} from '../domain/ports/nursing.repository';

const SYSTEM_NURSE_ID = 1;

@Injectable()
export class SevereAllergyNursingSubscriber {
  constructor(
    @Inject(NURSING_REPOSITORY) private readonly nursing: NursingRepository,
  ) {}

  @OnEvent(SEVERE_ALLERGY_RECORDED)
  async handle(event: SevereAllergyRecordedEvent): Promise<void> {
    await this.nursing.addNote({
      patientId: event.patientId,
      nurseId: SYSTEM_NURSE_ID,
      content: `ALERT: severe allergy to ${event.substance}. Notify the floor team.`,
    });
  }
}
