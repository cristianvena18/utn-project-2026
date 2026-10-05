import { Column } from 'typeorm';
import { CreateDateColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { InsuranceType } from '../../domain/patient';

@Entity('patients')
export class PatientOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'national_id', unique: true })
  nationalId: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'birth_date' })
  birthDate: string;

  @Column({ name: 'insurance_type', type: 'text' })
  insuranceType: InsuranceType;

  @Column({ name: 'insurance_name', type: 'text', nullable: true })
  insuranceName: string | null;

  @Column({ name: 'user_id', type: 'integer', nullable: true })
  userId: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
