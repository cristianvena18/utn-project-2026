import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../domain/role';
import { UserRecord, UserRepository } from '../../domain/ports/user.repository';
import { UserOrmEntity } from './user.orm-entity';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserRecord | null> {
    const row = await this.repo.findOne({ where: { email } });
    return row ? this.toRecord(row) : null;
  }

  async findById(id: number): Promise<UserRecord | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? this.toRecord(row) : null;
  }

  async create(input: {
    email: string;
    passwordHash: string;
    name: string;
    role: Role;
  }): Promise<UserRecord> {
    const saved = await this.repo.save(
      this.repo.create({
        email: input.email,
        passwordHash: input.passwordHash,
        name: input.name,
        role: input.role,
      }),
    );
    return this.toRecord(saved);
  }

  async list(): Promise<UserRecord[]> {
    const rows = await this.repo.find({ order: { id: 'ASC' } });
    return rows.map((row) => this.toRecord(row));
  }

  private toRecord(row: UserOrmEntity): UserRecord {
    return {
      id: row.id,
      email: row.email,
      passwordHash: row.passwordHash,
      name: row.name,
      role: row.role,
    };
  }
}
