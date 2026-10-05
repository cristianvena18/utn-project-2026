import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundException } from '../../../shared/exceptions/resource-not-found.exception';
import {
  PATIENT_REPOSITORY,
  type PatientRepository,
} from '../../admissions/domain/ports/patient.repository';
import { type AuthUser } from '../../iam/domain/role';
import {
  AdmissionType,
  CareProtocolBuilder,
} from '../domain/care-protocol.builder';
import {
  NURSING_REPOSITORY,
  type NursingRepository,
} from '../domain/ports/nursing.repository';

@Injectable()
export class BuildCareProtocolUseCase {
  constructor(
    @Inject(NURSING_REPOSITORY) private readonly nursing: NursingRepository,
    @Inject(PATIENT_REPOSITORY) private readonly patients: PatientRepository,
  ) {}

  async execute(
    patientId: number,
    user: AuthUser,
    input: {
      admissionType: AdmissionType;
      withMedicationMonitoring?: boolean;
      withAllergyPrecautions?: boolean;
    },
  ) {
    const patient = await this.patients.findById(patientId);
    if (!patient) {
      throw new ResourceNotFoundException('Patient', patientId);
    }
    const builder = new CareProtocolBuilder().forAdmissionType(
      input.admissionType,
    );
    if (input.withMedicationMonitoring) {
      builder.withMedicationMonitoring();
    }
    if (input.withAllergyPrecautions) {
      builder.withAllergyPrecautions();
    }
    const { steps } = builder.build();
    return this.nursing.addProtocol({
      patientId,
      admissionType: input.admissionType,
      steps,
      createdBy: user.id,
    });
  }
}
