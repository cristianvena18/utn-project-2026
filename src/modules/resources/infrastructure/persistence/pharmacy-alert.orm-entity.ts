import { Column } from 'typeorm';
import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';

@Entity('pharmacy_alerts')
export class PharmacyAlertOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'patient_id' })
  patientId: number;

  @Column()
  substance: string;

  @Column()
  message: string;

  @Column({
    name: 'created_at',
    type: 'datetime',
    default: () => "datetime('now')",
  })
  createdAt: Date;
}
