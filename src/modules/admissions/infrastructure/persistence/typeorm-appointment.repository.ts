import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError } from 'typeorm';
import { Repository } from 'typeorm';
import { DuplicateBookingException } from '../../../../shared/exceptions/duplicate-booking.exception';
import { OptimisticLockException } from '../../../../shared/exceptions/optimistic-lock.exception';
import {
  AppointmentRecord,
  AppointmentStatus,
  TriageLevel,
} from '../../domain/appointment';
import { type AppointmentRepository } from '../../domain/ports/appointment.repository';
import { AppointmentOrmEntity } from './appointment.orm-entity';

@Injectable()
export class TypeOrmAppointmentRepository implements AppointmentRepository {
  constructor(
    @InjectRepository(AppointmentOrmEntity)
    private readonly repo: Repository<AppointmentOrmEntity>,
  ) {}

  async create(input: {
    patientId: number;
    doctorId: number;
    scheduledAt: string;
  }): Promise<AppointmentRecord> {
    try {
      const saved = await this.repo.save(
        this.repo.create({
          ...input,
          status: AppointmentStatus.SCHEDULED,
          triageLevel: null,
        }),
      );
      return this.toRecord(saved);
    } catch (error) {
      this.rethrowDuplicate(error);
      throw error;
    }
  }

  async findById(id: number): Promise<AppointmentRecord | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? this.toRecord(row) : null;
  }

  async list(): Promise<AppointmentRecord[]> {
    const rows = await this.repo.find({ order: { scheduledAt: 'ASC' } });
    return rows.map((row) => this.toRecord(row));
  }

  async updateStatus(
    appointment: AppointmentRecord,
    status: AppointmentStatus,
    triageLevel?: TriageLevel | null,
  ): Promise<AppointmentRecord> {
    const row = await this.repo.findOne({ where: { id: appointment.id } });
    if (!row || row.version !== appointment.version) {
      throw new OptimisticLockException('appointment');
    }
    row.status = status;
    if (triageLevel !== undefined) {
      row.triageLevel = triageLevel;
    }
    try {
      const saved = await this.repo.save(row);
      return this.toRecord(saved);
    } catch (error) {
      this.rethrowDuplicate(error);
      throw error;
    }
  }

  private rethrowDuplicate(error: unknown): void {
    if (
      error instanceof QueryFailedError &&
      String(error.message).includes('UNIQUE')
    ) {
      throw new DuplicateBookingException();
    }
  }

  private toRecord(row: AppointmentOrmEntity): AppointmentRecord {
    return {
      id: row.id,
      patientId: row.patientId,
      doctorId: row.doctorId,
      scheduledAt: row.scheduledAt,
      status: row.status,
      triageLevel: row.triageLevel,
      version: row.version,
    };
  }
}
