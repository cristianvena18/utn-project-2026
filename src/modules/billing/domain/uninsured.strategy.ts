import { type BillingQuote, type BillingStrategy } from './billing.strategy';

export class UninsuredStrategy implements BillingStrategy {
  readonly name = 'UNINSURED';

  quote(baseAmount: number): BillingQuote {
    return {
      billedAmount: baseAmount,
      strategy: this.name,
      coverageValid: false,
    };
  }
}
