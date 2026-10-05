import { ConflictException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundException } from '../../../shared/exceptions/resource-not-found.exception';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../iam/domain/ports/user.repository';
import { InsuranceType } from '../domain/patient';
import {
  PATIENT_REPOSITORY,
  type PatientRepository,
} from '../domain/ports/patient.repository';

@Injectable()
export class RegisterPatientUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY) private readonly patients: PatientRepository,
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(input: {
    nationalId: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    insuranceType: InsuranceType;
    insuranceName?: string;
    userId?: number;
  }) {
    const existing = await this.patients.findByNationalId(input.nationalId);
    if (existing) {
      throw new ConflictException(
        'A patient with that national id already exists',
      );
    }
    if (input.userId) {
      const user = await this.users.findById(input.userId);
      if (!user) {
        throw new ResourceNotFoundException('User', input.userId);
      }
    }
    return this.patients.create({
      nationalId: input.nationalId,
      firstName: input.firstName,
      lastName: input.lastName,
      birthDate: input.birthDate,
      insuranceType: input.insuranceType,
      insuranceName: input.insuranceName ?? null,
      userId: input.userId ?? null,
    });
  }
}
