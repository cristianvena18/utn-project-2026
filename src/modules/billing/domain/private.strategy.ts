import { type BillingQuote, type BillingStrategy } from './billing.strategy';

const PRIVATE_COPAY_RATE = 0.2;

export class PrivateStrategy implements BillingStrategy {
  readonly name = 'PRIVATE_COPAY';

  quote(baseAmount: number): BillingQuote {
    return {
      billedAmount: Number((baseAmount * PRIVATE_COPAY_RATE).toFixed(2)),
      strategy: this.name,
      coverageValid: true,
    };
  }
}
