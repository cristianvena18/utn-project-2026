import { Inject, Injectable } from '@nestjs/common';
import {
  CHARGE_REPOSITORY,
  type ChargeRepository,
} from '../domain/ports/charge.repository';

@Injectable()
export class BillingReportUseCase {
  constructor(
    @Inject(CHARGE_REPOSITORY) private readonly charges: ChargeRepository,
  ) {}

  async execute() {
    const charges = await this.charges.list();
    const billedTotal = charges.reduce(
      (sum, item) => sum + item.billedAmount,
      0,
    );
    const baseTotal = charges.reduce((sum, item) => sum + item.baseAmount, 0);
    return {
      count: charges.length,
      baseTotal,
      billedTotal,
      charges,
    };
  }
}
