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
export class PrescribeIndicationUseCase {
  constructor(
    @Inject(NURSING_REPOSITORY) private readonly nursing: NursingRepository,
    @Inject(PATIENT_REPOSITORY) private readonly patients: PatientRepository,
  ) {}

  async execute(patientId: number, user: AuthUser, description: string) {
    const patient = await this.patients.findById(patientId);
    if (!patient) {
      throw new ResourceNotFoundException('Patient', patientId);
    }
    return this.nursing.addIndication({
      patientId,
      prescribedBy: user.id,
      description,
    });
  }
}
