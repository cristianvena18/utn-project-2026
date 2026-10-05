import { Column } from 'typeorm';
import { CreateDateColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { ClinicalEventType } from '../../domain/clinical-event';

@Entity('clinical_events')
export class ClinicalEventOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'patient_id' })
  patientId: number;

  @Column({ type: 'text' })
  type: ClinicalEventType;

  @Column({ type: 'simple-json' })
  payload: Record<string, unknown>;

  @Column({ name: 'created_by' })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
