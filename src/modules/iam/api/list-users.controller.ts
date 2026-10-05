import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListUsersUseCase } from '../application/list-users.use-case';
import { Role } from '../domain/role';
import { Roles } from './roles.decorator';

@ApiTags('iam')
@ApiBearerAuth()
@Controller()
export class ListUsersController {
  constructor(private readonly listUsers: ListUsersUseCase) {}

  @Get('users')
  @Roles(Role.ADMINISTRATOR)
  @ApiOperation({ summary: 'List users' })
  list() {
    return this.listUsers.execute();
  }
}
