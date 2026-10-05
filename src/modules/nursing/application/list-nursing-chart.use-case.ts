import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import {
  NURSING_REPOSITORY,
  type NursingRepository,
} from '../domain/ports/nursing.repository';

@Injectable()
export class ListNursingChartUseCase {
  constructor(
    @Inject(NURSING_REPOSITORY) private readonly nursing: NursingRepository,
  ) {}

  async execute(patientId: number) {
    const [vitals, notes] = await Promise.all([
      this.nursing.listVitalSigns(patientId),
      this.nursing.listNotes(patientId),
    ]);
    return { vitals, notes };
  }
}
