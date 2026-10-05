import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { type PharmacyAlertRepository } from '../../domain/ports/resources.repository';
import { PharmacyAlertOrmEntity } from './pharmacy-alert.orm-entity';

@Injectable()
export class TypeOrmPharmacyAlertRepository implements PharmacyAlertRepository {
  constructor(
    @InjectRepository(PharmacyAlertOrmEntity)
    private readonly repo: Repository<PharmacyAlertOrmEntity>,
  ) {}

  async add(input: {
    patientId: number;
    substance: string;
    message: string;
  }): Promise<void> {
    await this.repo.save(this.repo.create(input));
  }

  async list() {
    return this.repo.find({ order: { id: 'DESC' } });
  }
}
