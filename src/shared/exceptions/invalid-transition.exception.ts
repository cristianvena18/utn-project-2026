import { DomainException } from './domain-exception';

export class InvalidTransitionException extends DomainException {
  constructor(from: string, to: string) {
    super(`Invalid transition: "${from}" cannot move to "${to}"`, 400);
  }
}
