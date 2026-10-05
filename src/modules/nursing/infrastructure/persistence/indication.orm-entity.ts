import { Column } from 'typeorm';
import { CreateDateColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';

@Entity('indications')
export class IndicationOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'patient_id' })
  patientId: number;

  @Column({ name: 'prescribed_by' })
  prescribedBy: number;

  @Column()
  description: string;

  @Column({ type: 'text' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
