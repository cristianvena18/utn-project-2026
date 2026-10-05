import { Column } from 'typeorm';
import { CreateDateColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';

@Entity('medication_administrations')
export class MedicationAdministrationOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'indication_id' })
  indicationId: number;

  @Column({ name: 'patient_id' })
  patientId: number;

  @Column({ name: 'nurse_id' })
  nurseId: number;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
