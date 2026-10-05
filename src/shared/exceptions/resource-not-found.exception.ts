import { DomainException } from './domain-exception';

export class ResourceNotFoundException extends DomainException {
  constructor(resource: string, id: string | number) {
    super(`${resource} ${id} was not found`, 404);
  }
}
