import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AllergyRecord,
  AllergySeverity,
  ClinicalEventRecord,
  ClinicalEventType,
} from '../../domain/clinical-event';
import { type ClinicalEventRepository } from '../../domain/ports/clinical-event.repository';
import { AllergyOrmEntity } from './allergy.orm-entity';
import { ClinicalEventOrmEntity } from './clinical-event.orm-entity';

@Injectable()
export class TypeOrmClinicalEventRepository implements ClinicalEventRepository {
  constructor(
    @InjectRepository(ClinicalEventOrmEntity)
    private readonly events: Repository<ClinicalEventOrmEntity>,
    @InjectRepository(AllergyOrmEntity)
    private readonly allergies: Repository<AllergyOrmEntity>,
  ) {}

  async append(input: {
    patientId: number;
    type: ClinicalEventType;
    payload: Record<string, unknown>;
    createdBy: number;
  }): Promise<ClinicalEventRecord> {
    const saved = await this.events.save(this.events.create(input));
    return {
      id: saved.id,
      patientId: saved.patientId,
      type: saved.type,
      payload: saved.payload,
      createdBy: saved.createdBy,
      createdAt: saved.createdAt,
    };
  }

  async listByPatient(patientId: number): Promise<ClinicalEventRecord[]> {
    const rows = await this.events.find({
      where: { patientId },
      order: { id: 'ASC' },
    });
    return rows.map((row) => ({
      id: row.id,
      patientId: row.patientId,
      type: row.type,
      payload: row.payload,
      createdBy: row.createdBy,
      createdAt: row.createdAt,
    }));
  }

  async addAllergy(input: {
    patientId: number;
    substance: string;
    severity: AllergySeverity;
    clinicalEventId: number;
  }): Promise<AllergyRecord> {
    const saved = await this.allergies.save(this.allergies.create(input));
    return {
      id: saved.id,
      patientId: saved.patientId,
      substance: saved.substance,
      severity: saved.severity,
      clinicalEventId: saved.clinicalEventId,
    };
  }

  async listAllergies(patientId: number): Promise<AllergyRecord[]> {
    const rows = await this.allergies.find({
      where: { patientId },
      order: { id: 'ASC' },
    });
    return rows.map((row) => ({
      id: row.id,
      patientId: row.patientId,
      substance: row.substance,
      severity: row.severity,
      clinicalEventId: row.clinicalEventId,
    }));
  }
}
