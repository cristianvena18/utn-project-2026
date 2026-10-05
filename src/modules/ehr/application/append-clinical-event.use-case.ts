import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ResourceNotFoundException } from '../../../shared/exceptions/resource-not-found.exception';
import {
  SEVERE_ALLERGY_RECORDED,
  SevereAllergyRecordedEvent,
} from '../../../shared/integration-events/severe-allergy-recorded.event';
import {
  PATIENT_REPOSITORY,
  type PatientRepository,
} from '../../admissions/domain/ports/patient.repository';
import { type AuthUser } from '../../iam/domain/role';
import { AllergySeverity, ClinicalEventType } from '../domain/clinical-event';
import {
  CLINICAL_EVENT_REPOSITORY,
  type ClinicalEventRepository,
} from '../domain/ports/clinical-event.repository';

@Injectable()
export class AppendClinicalEventUseCase {
  constructor(
    @Inject(CLINICAL_EVENT_REPOSITORY)
    private readonly clinical: ClinicalEventRepository,
    @Inject(PATIENT_REPOSITORY) private readonly patients: PatientRepository,
    private readonly events: EventEmitter2,
  ) {}

  async execute(
    patientId: number,
    user: AuthUser,
    input: {
      type: ClinicalEventType;
      payload: Record<string, unknown>;
    },
  ) {
    const patient = await this.patients.findById(patientId);
    if (!patient) {
      throw new ResourceNotFoundException('Patient', patientId);
    }

    const event = await this.clinical.append({
      patientId,
      type: input.type,
      payload: input.payload,
      createdBy: user.id,
    });

    if (input.type === ClinicalEventType.ALLERGY) {
      const substance =
        typeof input.payload.substance === 'string'
          ? input.payload.substance
          : '';
      const severity =
        (input.payload.severity as AllergySeverity) ?? AllergySeverity.MILD;
      await this.clinical.addAllergy({
        patientId,
        substance,
        severity,
        clinicalEventId: event.id,
      });
      if (severity === AllergySeverity.SEVERE) {
        this.events.emit(
          SEVERE_ALLERGY_RECORDED,
          new SevereAllergyRecordedEvent(patientId, substance),
        );
      }
    }

    return event;
  }
}
