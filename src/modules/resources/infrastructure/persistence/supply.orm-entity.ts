import { Column } from 'typeorm';
import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';

@Entity('supplies')
export class SupplyOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'integer' })
  stock: number;

  @Column()
  unit: string;
}
