import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AdmissionType,
  IndicationStatus,
} from '../../domain/care-protocol.builder';
import {
  CareProtocolRecord,
  IndicationRecord,
  MedicationAdministrationRecord,
  NursingNoteRecord,
  type NursingRepository,
  VitalSignRecord,
} from '../../domain/ports/nursing.repository';
import { CareProtocolOrmEntity } from './care-protocol.orm-entity';
import { IndicationOrmEntity } from './indication.orm-entity';
import { MedicationAdministrationOrmEntity } from './medication-administration.orm-entity';
import { NursingNoteOrmEntity } from './nursing-note.orm-entity';
import { VitalSignOrmEntity } from './vital-sign.orm-entity';

@Injectable()
export class TypeOrmNursingRepository implements NursingRepository {
  constructor(
    @InjectRepository(VitalSignOrmEntity)
    private readonly vitals: Repository<VitalSignOrmEntity>,
    @InjectRepository(IndicationOrmEntity)
    private readonly indications: Repository<IndicationOrmEntity>,
    @InjectRepository(MedicationAdministrationOrmEntity)
    private readonly administrations: Repository<MedicationAdministrationOrmEntity>,
    @InjectRepository(NursingNoteOrmEntity)
    private readonly notes: Repository<NursingNoteOrmEntity>,
    @InjectRepository(CareProtocolOrmEntity)
    private readonly protocols: Repository<CareProtocolOrmEntity>,
  ) {}

  async addVitalSigns(
    input: Omit<VitalSignRecord, 'id' | 'createdAt'>,
  ): Promise<VitalSignRecord> {
    const saved = await this.vitals.save(this.vitals.create(input));
    return saved;
  }

  listVitalSigns(patientId: number): Promise<VitalSignRecord[]> {
    return this.vitals.find({ where: { patientId }, order: { id: 'DESC' } });
  }

  async addIndication(
    input: Omit<IndicationRecord, 'id' | 'status'>,
  ): Promise<IndicationRecord> {
    const saved = await this.indications.save(
      this.indications.create({
        ...input,
        status: IndicationStatus.PENDING,
      }),
    );
    return saved as IndicationRecord;
  }

  async findIndication(id: number): Promise<IndicationRecord | null> {
    const row = await this.indications.findOne({ where: { id } });
    return row as IndicationRecord | null;
  }

  async markIndicationExecuted(id: number): Promise<void> {
    await this.indications.update(id, {
      status: IndicationStatus.ADMINISTERED,
    });
  }

  async addAdministration(
    input: Omit<MedicationAdministrationRecord, 'id'>,
  ): Promise<MedicationAdministrationRecord> {
    const saved = await this.administrations.save(
      this.administrations.create(input),
    );
    return saved;
  }

  async addNote(
    input: Omit<NursingNoteRecord, 'id' | 'createdAt'>,
  ): Promise<NursingNoteRecord> {
    return this.notes.save(this.notes.create(input));
  }

  listNotes(patientId: number): Promise<NursingNoteRecord[]> {
    return this.notes.find({ where: { patientId }, order: { id: 'DESC' } });
  }

  async addProtocol(input: {
    patientId: number;
    admissionType: AdmissionType;
    steps: string[];
    createdBy: number;
  }): Promise<CareProtocolRecord> {
    const saved = await this.protocols.save(this.protocols.create(input));
    return {
      id: saved.id,
      patientId: saved.patientId,
      admissionType: saved.admissionType as AdmissionType,
      steps: saved.steps,
    };
  }
}
