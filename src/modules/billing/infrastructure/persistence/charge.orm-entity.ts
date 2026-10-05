import { Column } from 'typeorm';
import { CreateDateColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { InsuranceType } from '../../../admissions/domain/patient';

@Entity('charges')
export class ChargeOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'patient_id' })
  patientId: number;

  @Column()
  concept: string;

  @Column({ name: 'base_amount', type: 'real' })
  baseAmount: number;

  @Column({ name: 'billed_amount', type: 'real' })
  billedAmount: number;

  @Column({ name: 'insurance_type', type: 'text' })
  insuranceType: InsuranceType;

  @Column()
  strategy: string;

  @Column({ name: 'source_type' })
  sourceType: string;

  @Column({ name: 'source_id' })
  sourceId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
