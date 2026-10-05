import { Role } from '../role';

export type UserRecord = {
  id: number;
  email: string;
  passwordHash: string;
  name: string;
  role: Role;
};

export interface UserRepository {
  findByEmail(email: string): Promise<UserRecord | null>;
  findById(id: number): Promise<UserRecord | null>;
  create(input: {
    email: string;
    passwordHash: string;
    name: string;
    role: Role;
  }): Promise<UserRecord>;
  list(): Promise<UserRecord[]>;
}

export const USER_REPOSITORY = Symbol.for('PORT:UserRepository');
