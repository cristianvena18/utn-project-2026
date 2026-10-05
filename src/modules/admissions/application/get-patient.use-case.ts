import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundException } from '../../../shared/exceptions/resource-not-found.exception';
import {
  PATIENT_REPOSITORY,
  type PatientRepository,
} from '../domain/ports/patient.repository';

@Injectable()
export class GetPatientUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY) private readonly patients: PatientRepository,
  ) {}

  async execute(id: number) {
    const patient = await this.patients.findById(id);
    if (!patient) {
      throw new ResourceNotFoundException('Patient', id);
    }
    return patient;
  }
}
