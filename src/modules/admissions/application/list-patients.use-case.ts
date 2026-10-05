import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import {
  PATIENT_REPOSITORY,
  type PatientRepository,
} from '../domain/ports/patient.repository';

@Injectable()
export class ListPatientsUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY) private readonly patients: PatientRepository,
  ) {}

  execute() {
    return this.patients.list();
  }
}
