import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DomainException } from '../../../shared/exceptions/domain-exception';
import { ResourceNotFoundException } from '../../../shared/exceptions/resource-not-found.exception';
import {
  MEDICATION_ADMINISTERED,
  MedicationAdministeredEvent,
} from '../../../shared/integration-events/medication-administered.event';
import { type AuthUser } from '../../iam/domain/role';
import { IndicationStatus } from '../domain/care-protocol.builder';
import {
  NURSING_REPOSITORY,
  type NursingRepository,
} from '../domain/ports/nursing.repository';

@Injectable()
export class AdministerMedicationUseCase {
  constructor(
    @Inject(NURSING_REPOSITORY) private readonly nursing: NursingRepository,
    private readonly events: EventEmitter2,
  ) {}

  async execute(indicationId: number, user: AuthUser, notes?: string) {
    const indication = await this.nursing.findIndication(indicationId);
    if (!indication) {
      throw new ResourceNotFoundException('Indication', indicationId);
    }
    if (indication.status === IndicationStatus.ADMINISTERED) {
      throw new DomainException('The indication was already administered', 409);
    }
    const administration = await this.nursing.addAdministration({
      indicationId,
      patientId: indication.patientId,
      nurseId: user.id,
      notes: notes ?? null,
    });
    await this.nursing.markIndicationExecuted(indicationId);
    this.events.emit(
      MEDICATION_ADMINISTERED,
      new MedicationAdministeredEvent(administration.id, indication.patientId),
    );
    return administration;
  }
}
