import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InvalidTransitionException } from '../../../shared/exceptions/invalid-transition.exception';
import { ResourceNotFoundException } from '../../../shared/exceptions/resource-not-found.exception';
import { BedStateMachine, BedStatus } from '../domain/bed';
import {
  BED_REPOSITORY,
  type BedRepository,
} from '../domain/ports/resources.repository';

@Injectable()
export class BlockBedUseCase {
  constructor(
    @Inject(BED_REPOSITORY) private readonly beds: BedRepository,
    private readonly machine: BedStateMachine,
  ) {}

  async execute(bedId: number, reason: string) {
    const bed = await this.beds.findById(bedId);
    if (!bed) {
      throw new ResourceNotFoundException('Bed', bedId);
    }
    if (!this.machine.canTransition(bed.status, BedStatus.BLOCKED)) {
      throw new InvalidTransitionException(bed.status, BedStatus.BLOCKED);
    }
    return this.beds.save({
      ...bed,
      status: BedStatus.BLOCKED,
      blockReason: reason,
    });
  }
}
