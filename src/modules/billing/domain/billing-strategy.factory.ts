import { InsuranceType } from '../../admissions/domain/patient';
import { type BillingStrategy } from './billing.strategy';
import { PrivateStrategy } from './private.strategy';
import { PublicStrategy } from './public.strategy';
import { UninsuredStrategy } from './uninsured.strategy';

export class BillingStrategyFactory {
  create(type: InsuranceType): BillingStrategy {
    switch (type) {
      case InsuranceType.PRIVATE:
        return new PrivateStrategy();
      case InsuranceType.PUBLIC:
        return new PublicStrategy();
      default:
        return new UninsuredStrategy();
    }
  }
}
