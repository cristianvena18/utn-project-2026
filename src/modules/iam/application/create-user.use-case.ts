import { ConflictException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../domain/ports/user.repository';
import { Role } from '../domain/role';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(input: {
    email: string;
    password: string;
    name: string;
    role: Role;
  }) {
    const email = input.email.toLowerCase();
    const existing = await this.users.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email is already registered');
    }
    const passwordHash = await hash(input.password, 10);
    const user = await this.users.create({
      email,
      passwordHash,
      name: input.name,
      role: input.role,
    });
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
