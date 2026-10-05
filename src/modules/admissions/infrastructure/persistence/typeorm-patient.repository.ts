import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientRecord } from '../../domain/patient';
import { type PatientRepository } from '../../domain/ports/patient.repository';
import { PatientOrmEntity } from './patient.orm-entity';

@Injectable()
export class TypeOrmPatientRepository implements PatientRepository {
  constructor(
    @InjectRepository(PatientOrmEntity)
    private readonly repo: Repository<PatientOrmEntity>,
  ) {}

  async create(input: Omit<PatientRecord, 'id'>): Promise<PatientRecord> {
    const saved = await this.repo.save(this.repo.create(input));
    return this.toRecord(saved);
  }

  async findById(id: number): Promise<PatientRecord | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? this.toRecord(row) : null;
  }

  async findByNationalId(nationalId: string): Promise<PatientRecord | null> {
    const row = await this.repo.findOne({ where: { nationalId } });
    return row ? this.toRecord(row) : null;
  }

  async list(): Promise<PatientRecord[]> {
    const rows = await this.repo.find({ order: { id: 'ASC' } });
    return rows.map((row) => this.toRecord(row));
  }

  private toRecord(row: PatientOrmEntity): PatientRecord {
    return {
      id: row.id,
      nationalId: row.nationalId,
      firstName: row.firstName,
      lastName: row.lastName,
      birthDate: row.birthDate,
      insuranceType: row.insuranceType,
      insuranceName: row.insuranceName,
      userId: row.userId,
    };
  }
}
