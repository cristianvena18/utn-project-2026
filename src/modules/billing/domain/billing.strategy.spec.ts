import { InsuranceType } from '../../admissions/domain/patient';
import { BillingStrategyFactory } from './billing-strategy.factory';

describe('BillingStrategyFactory', () => {
  const factory = new BillingStrategyFactory();

  it('charges 20% copay for private insurance', () => {
    const strategy = factory.create(InsuranceType.PRIVATE);

    const quote = strategy.quote(1000);

    expect(quote).toEqual({
      billedAmount: 200,
      strategy: 'PRIVATE_COPAY',
      coverageValid: true,
    });
  });

  it('charges 0 for public coverage', () => {
    const strategy = factory.create(InsuranceType.PUBLIC);

    const quote = strategy.quote(1000);

    expect(quote.billedAmount).toBe(0);
  });

  it('charges full amount without insurance', () => {
    const strategy = factory.create(InsuranceType.UNINSURED);

    const quote = strategy.quote(1000);

    expect(quote.billedAmount).toBe(1000);
  });
});
