import { InsuranceType } from '../../admissions/domain/patient';
import { BillingStrategyFactory } from './billing-strategy.factory';

describe('BillingStrategyFactory', () => {
  const factory = new BillingStrategyFactory();

  it('charges 20% copay for private insurance', () => {
    expect(factory.create(InsuranceType.PRIVATE).quote(1000)).toEqual({
      billedAmount: 200,
      strategy: 'PRIVATE_COPAY',
      coverageValid: true,
    });
  });

  it('charges 0 for public coverage', () => {
    expect(factory.create(InsuranceType.PUBLIC).quote(1000).billedAmount).toBe(
      0,
    );
  });

  it('charges full amount without insurance', () => {
    expect(
      factory.create(InsuranceType.UNINSURED).quote(1000).billedAmount,
    ).toBe(1000);
  });
});
