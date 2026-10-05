import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InvalidTransitionException } from '../../../shared/exceptions/invalid-transition.exception';
import { ResourceNotFoundException } from '../../../shared/exceptions/resource-not-found.exception';
import {
  BED_ASSIGNED,
  BedAssignedEvent,
} from '../../../shared/integration-events/bed-assigned.event';
import {
  PATIENT_REPOSITORY,
  type PatientRepository,
} from '../../admissions/domain/ports/patient.repository';
import { BedStateMachine, BedStatus } from '../domain/bed';
import {
  BED_REPOSITORY,
  type BedRepository,
} from '../domain/ports/resources.repository';

@Injectable()
export class AssignBedUseCase {
  constructor(
    @Inject(BED_REPOSITORY) private readonly beds: BedRepository,
    @Inject(PATIENT_REPOSITORY) private readonly patients: PatientRepository,
    private readonly machine: BedStateMachine,
    private readonly events: EventEmitter2,
  ) {}

  async execute(bedId: number, patientId: number) {
    const bed = await this.beds.findById(bedId);
    if (!bed) {
      throw new ResourceNotFoundException('Bed', bedId);
    }
    const patient = await this.patients.findById(patientId);
    if (!patient) {
      throw new ResourceNotFoundException('Patient', patientId);
    }
    if (!this.machine.canTransition(bed.status, BedStatus.OCCUPIED)) {
      throw new InvalidTransitionException(bed.status, BedStatus.OCCUPIED);
    }
    const updated = await this.beds.save({
      ...bed,
      status: BedStatus.OCCUPIED,
      patientId,
      blockReason: null,
    });
    this.events.emit(BED_ASSIGNED, new BedAssignedEvent(updated.id, patientId));
    return updated;
  }
}
