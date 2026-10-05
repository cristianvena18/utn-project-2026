import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundException } from '../../../shared/exceptions/resource-not-found.exception';
import {
  PATIENT_REPOSITORY,
  type PatientRepository,
} from '../../admissions/domain/ports/patient.repository';
import { type AuthUser } from '../../iam/domain/role';
import {
  NURSING_REPOSITORY,
  type NursingRepository,
} from '../domain/ports/nursing.repository';

@Injectable()
export class RecordVitalSignsUseCase {
  constructor(
    @Inject(NURSING_REPOSITORY) private readonly nursing: NursingRepository,
    @Inject(PATIENT_REPOSITORY) private readonly patients: PatientRepository,
  ) {}

  async execute(
    patientId: number,
    user: AuthUser,
    input: {
      systolic: number;
      diastolic: number;
      heartRate: number;
      temperature: number;
      spo2: number;
    },
  ) {
    const patient = await this.patients.findById(patientId);
    if (!patient) {
      throw new ResourceNotFoundException('Patient', patientId);
    }
    return this.nursing.addVitalSigns({
      patientId,
      recordedBy: user.id,
      ...input,
    });
  }
}
