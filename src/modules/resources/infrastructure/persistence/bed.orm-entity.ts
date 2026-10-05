import { Column } from 'typeorm';
import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { VersionColumn } from 'typeorm';
import { BedStatus } from '../../domain/bed';

@Entity('beds')
export class BedOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'text' })
  status: BedStatus;

  @Column({ name: 'patient_id', type: 'integer', nullable: true })
  patientId: number | null;

  @Column({ name: 'block_reason', type: 'text', nullable: true })
  blockReason: string | null;

  @VersionColumn()
  version: number;
}
