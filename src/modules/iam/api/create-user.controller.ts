import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserUseCase } from '../application/create-user.use-case';
import { Role } from '../domain/role';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from './roles.decorator';

@ApiTags('iam')
@ApiBearerAuth()
@Controller()
export class CreateUserController {
  constructor(private readonly createUser: CreateUserUseCase) {}

  @Post('users')
  @Roles(Role.ADMINISTRATOR)
  @ApiOperation({ summary: 'Create user' })
  create(@Body() dto: CreateUserDto) {
    return this.createUser.execute(dto);
  }
}
