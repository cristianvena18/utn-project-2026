import { DomainException } from './domain-exception';

export class InsufficientStockException extends DomainException {
  constructor(name: string) {
    super(`Insufficient stock of ${name}`, 409);
  }
}
