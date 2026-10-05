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
export class DischargeBedUseCase {
  constructor(
    @Inject(BED_REPOSITORY) private readonly beds: BedRepository,
    private readonly machine: BedStateMachine,
  ) {}

  async execute(bedId: number) {
    return this.transition(bedId, BedStatus.CLEANING, { patientId: null });
  }

  private async transition(
    bedId: number,
    to: BedStatus,
    extra: Partial<{ patientId: number | null; blockReason: string | null }>,
  ) {
    const bed = await this.beds.findById(bedId);
    if (!bed) {
      throw new ResourceNotFoundException('Bed', bedId);
    }
    if (!this.machine.canTransition(bed.status, to)) {
      throw new InvalidTransitionException(bed.status, to);
    }
    return this.beds.save({ ...bed, status: to, ...extra });
  }
}
