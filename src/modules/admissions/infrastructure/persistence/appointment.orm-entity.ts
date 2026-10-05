import { Column } from 'typeorm';
import { CreateDateColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Unique } from 'typeorm';
import { VersionColumn } from 'typeorm';
import { AppointmentStatus, TriageLevel } from '../../domain/appointment';

@Entity('appointments')
@Unique(['doctorId', 'scheduledAt'])
export class AppointmentOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'patient_id' })
  patientId: number;

  @Column({ name: 'doctor_id' })
  doctorId: number;

  @Column({ name: 'scheduled_at' })
  scheduledAt: string;

  @Column({ type: 'text' })
  status: AppointmentStatus;

  @Column({ name: 'triage_level', type: 'text', nullable: true })
  triageLevel: TriageLevel | null;

  @VersionColumn()
  version: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
