import { Column } from 'typeorm';
import { CreateDateColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../domain/role';

@Entity('users')
export class UserOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  role: Role;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
