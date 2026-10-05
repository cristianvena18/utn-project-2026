import { Inject, Injectable } from '@nestjs/common';
import {
  PATIENT_REPOSITORY,
  type PatientRepository,
} from '../../admissions/domain/ports/patient.repository';
import { BillingStrategyFactory } from '../domain/billing-strategy.factory';
import {
  CHARGE_REPOSITORY,
  type ChargeRepository,
} from '../domain/ports/charge.repository';

@Injectable()
export class RegisterChargeUseCase {
  constructor(
    @Inject(CHARGE_REPOSITORY) private readonly charges: ChargeRepository,
    @Inject(PATIENT_REPOSITORY) private readonly patients: PatientRepository,
    private readonly factory: BillingStrategyFactory,
  ) {}

  async execute(input: {
    patientId: number;
    concept: string;
    baseAmount: number;
    sourceType: string;
    sourceId: number;
  }): Promise<void> {
    const patient = await this.patients.findById(input.patientId);
    if (!patient) {
      return;
    }
    const quote = this.factory
      .create(patient.insuranceType)
      .quote(input.baseAmount);
    await this.charges.create({
      patientId: input.patientId,
      concept: input.concept,
      baseAmount: input.baseAmount,
      billedAmount: quote.billedAmount,
      insuranceType: patient.insuranceType,
      strategy: quote.strategy,
      sourceType: input.sourceType,
      sourceId: input.sourceId,
    });
  }
}
