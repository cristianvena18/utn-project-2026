import { type BillingQuote, type BillingStrategy } from './billing.strategy';

export class PublicStrategy implements BillingStrategy {
  readonly name = 'PUBLIC_FULL_COVERAGE';

  quote(): BillingQuote {
    return {
      billedAmount: 0,
      strategy: this.name,
      coverageValid: true,
    };
  }
}
