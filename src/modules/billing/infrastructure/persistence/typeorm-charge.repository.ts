import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ChargeRecord,
  ChargeRepository,
} from '../../domain/ports/charge.repository';
import { ChargeOrmEntity } from './charge.orm-entity';

@Injectable()
export class TypeOrmChargeRepository implements ChargeRepository {
  constructor(
    @InjectRepository(ChargeOrmEntity)
    private readonly repo: Repository<ChargeOrmEntity>,
  ) {}

  async create(
    input: Omit<ChargeRecord, 'id' | 'createdAt'>,
  ): Promise<ChargeRecord> {
    return this.repo.save(this.repo.create(input));
  }

  list(): Promise<ChargeRecord[]> {
    return this.repo.find({ order: { id: 'DESC' } });
  }

  listByPatient(patientId: number): Promise<ChargeRecord[]> {
    return this.repo.find({ where: { patientId }, order: { id: 'DESC' } });
  }
}
