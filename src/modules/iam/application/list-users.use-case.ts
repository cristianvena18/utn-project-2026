import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../domain/ports/user.repository';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute() {
    const users = await this.users.list();
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }));
  }
}
