import { DomainException } from './domain-exception';

export class OptimisticLockException extends DomainException {
  constructor(resource = 'resource') {
    super(
      `Concurrency conflict: the ${resource} was modified by another user`,
      409,
    );
  }
}
