import { Column } from 'typeorm';
import { CreateDateColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { AllergySeverity } from '../../domain/clinical-event';

@Entity('allergies')
export class AllergyOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'patient_id' })
  patientId: number;

  @Column()
  substance: string;

  @Column({ type: 'text' })
  severity: AllergySeverity;

  @Column({ name: 'clinical_event_id' })
  clinicalEventId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
