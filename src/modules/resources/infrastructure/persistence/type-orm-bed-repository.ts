import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OptimisticLockException } from '../../../../shared/exceptions/optimistic-lock.exception';
import { BedRecord } from '../../domain/bed';
import { type BedRepository } from '../../domain/ports/resources.repository';
import { BedOrmEntity } from './bed.orm-entity';

@Injectable()
export class TypeOrmBedRepository implements BedRepository {
  constructor(
    @InjectRepository(BedOrmEntity)
    private readonly repo: Repository<BedOrmEntity>,
  ) {}

  async list(): Promise<BedRecord[]> {
    const rows = await this.repo.find({ order: { code: 'ASC' } });
    return rows.map((row) => this.toRecord(row));
  }

  async findById(id: number): Promise<BedRecord | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? this.toRecord(row) : null;
  }

  async save(bed: BedRecord): Promise<BedRecord> {
    const row = await this.repo.findOne({ where: { id: bed.id } });
    if (!row || row.version !== bed.version) {
      throw new OptimisticLockException('bed');
    }
    row.status = bed.status;
    row.patientId = bed.patientId;
    row.blockReason = bed.blockReason;
    const saved = await this.repo.save(row);
    return this.toRecord(saved);
  }

  private toRecord(row: BedOrmEntity): BedRecord {
    return {
      id: row.id,
      code: row.code,
      status: row.status,
      patientId: row.patientId,
      blockReason: row.blockReason,
      version: row.version,
    };
  }
}
