import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../domain/ports/user.repository';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    private readonly jwt: JwtService,
  ) {}

  async execute(email: string, password: string) {
    const user = await this.users.findByEmail(email.toLowerCase());
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const ok = await compare(password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
