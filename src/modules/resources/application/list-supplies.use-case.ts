import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import {
  SUPPLY_REPOSITORY,
  type SupplyRepository,
} from '../domain/ports/resources.repository';

@Injectable()
export class ListSuppliesUseCase {
  constructor(
    @Inject(SUPPLY_REPOSITORY) private readonly supplies: SupplyRepository,
  ) {}
  execute() {
    return this.supplies.list();
  }
}
