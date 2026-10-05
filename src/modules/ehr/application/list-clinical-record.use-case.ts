import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundException } from '../../../shared/exceptions/resource-not-found.exception';
import {
  PATIENT_REPOSITORY,
  type PatientRepository,
} from '../../admissions/domain/ports/patient.repository';
import {
  CLINICAL_EVENT_REPOSITORY,
  type ClinicalEventRepository,
} from '../domain/ports/clinical-event.repository';

@Injectable()
export class ListClinicalRecordUseCase {
  constructor(
    @Inject(CLINICAL_EVENT_REPOSITORY)
    private readonly clinical: ClinicalEventRepository,
    @Inject(PATIENT_REPOSITORY) private readonly patients: PatientRepository,
  ) {}

  async execute(patientId: number) {
    const patient = await this.patients.findById(patientId);
    if (!patient) {
      throw new ResourceNotFoundException('Patient', patientId);
    }
    const [events, allergies] = await Promise.all([
      this.clinical.listByPatient(patientId),
      this.clinical.listAllergies(patientId),
    ]);
    return { patient, events, allergies };
  }
}
