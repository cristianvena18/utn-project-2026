import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import {
  CHARGE_REPOSITORY,
  type ChargeRepository,
} from '../domain/ports/charge.repository';

@Injectable()
export class ListChargesUseCase {
  constructor(
    @Inject(CHARGE_REPOSITORY) private readonly charges: ChargeRepository,
  ) {}

  execute(patientId?: number) {
    if (patientId) {
      return this.charges.listByPatient(patientId);
    }
    return this.charges.list();
  }
}
