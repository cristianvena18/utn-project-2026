import { Column } from 'typeorm';
import { CreateDateColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';

@Entity('vital_signs')
export class VitalSignOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'patient_id' })
  patientId: number;

  @Column({ name: 'recorded_by' })
  recordedBy: number;

  @Column()
  systolic: number;

  @Column()
  diastolic: number;

  @Column({ name: 'heart_rate' })
  heartRate: number;

  @Column('real')
  temperature: number;

  @Column()
  spo2: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
