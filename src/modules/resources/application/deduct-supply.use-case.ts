import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundException } from '../../../shared/exceptions/resource-not-found.exception';
import {
  SUPPLY_REPOSITORY,
  type SupplyRepository,
} from '../domain/ports/resources.repository';

@Injectable()
export class DeductSupplyUseCase {
  constructor(
    @Inject(SUPPLY_REPOSITORY) private readonly supplies: SupplyRepository,
  ) {}

  async execute(supplyId: number, quantity: number, patientId?: number) {
    const supply = await this.supplies.findById(supplyId);
    if (!supply) {
      throw new ResourceNotFoundException('Supply', supplyId);
    }
    const updated = await this.supplies.deduct(supplyId, quantity);
    await this.supplies.addMovement({
      supplyId,
      quantity,
      patientId: patientId ?? null,
    });
    return updated;
  }
}
