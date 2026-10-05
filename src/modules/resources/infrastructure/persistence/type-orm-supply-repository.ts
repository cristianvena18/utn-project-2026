import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsufficientStockException } from '../../../../shared/exceptions/insufficient-stock.exception';
import { SupplyRecord } from '../../domain/bed';
import { type SupplyRepository } from '../../domain/ports/resources.repository';
import { SupplyMovementOrmEntity } from './supply-movement.orm-entity';
import { SupplyOrmEntity } from './supply.orm-entity';

@Injectable()
export class TypeOrmSupplyRepository implements SupplyRepository {
  constructor(
    @InjectRepository(SupplyOrmEntity)
    private readonly supplies: Repository<SupplyOrmEntity>,
    @InjectRepository(SupplyMovementOrmEntity)
    private readonly movements: Repository<SupplyMovementOrmEntity>,
  ) {}

  async list(): Promise<SupplyRecord[]> {
    return this.supplies.find({ order: { name: 'ASC' } });
  }

  async findById(id: number): Promise<SupplyRecord | null> {
    return this.supplies.findOne({ where: { id } });
  }

  async deduct(id: number, quantity: number): Promise<SupplyRecord> {
    const result = await this.supplies
      .createQueryBuilder()
      .update(SupplyOrmEntity)
      .set({ stock: () => `stock - ${quantity}` })
      .where('id = :id AND stock >= :quantity', { id, quantity })
      .execute();
    if (!result.affected) {
      const supply = await this.findById(id);
      throw new InsufficientStockException(supply?.name ?? `supply ${id}`);
    }
    const updated = await this.findById(id);
    if (!updated) {
      throw new InsufficientStockException(`supply ${id}`);
    }
    return updated;
  }

  async addMovement(input: {
    supplyId: number;
    quantity: number;
    patientId: number | null;
  }): Promise<void> {
    await this.movements.save(this.movements.create(input));
  }
}
