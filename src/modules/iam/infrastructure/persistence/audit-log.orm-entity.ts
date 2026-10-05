import { Column } from 'typeorm';
import { CreateDateColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLogOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'integer', nullable: true })
  userId: number | null;

  @Column()
  action: string;

  @Column({ name: 'resource_type' })
  resourceType: string;

  @Column({ name: 'resource_id', type: 'text', nullable: true })
  resourceId: string | null;

  @Column()
  path: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
