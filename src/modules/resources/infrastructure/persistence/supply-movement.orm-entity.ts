import { Column } from 'typeorm';
import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';

@Entity('supply_movements')
export class SupplyMovementOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'supply_id' })
  supplyId: number;

  @Column()
  quantity: number;

  @Column({ name: 'patient_id', type: 'integer', nullable: true })
  patientId: number | null;

  @Column({
    name: 'created_at',
    type: 'datetime',
    default: () => "datetime('now')",
  })
  createdAt: Date;
}
