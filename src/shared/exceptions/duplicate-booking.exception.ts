import { DomainException } from './domain-exception';

export class DuplicateBookingException extends DomainException {
  constructor() {
    super('That doctor and time slot is already booked', 409);
  }
}
