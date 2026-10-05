import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { type AuthUser } from '../domain/role';
import { CurrentUser } from './current-user.decorator';

@ApiTags('iam')
@ApiBearerAuth()
@Controller()
export class CurrentUserController {
  @Get('auth/me')
  @ApiOperation({ summary: 'Authenticated user' })
  me(@CurrentUser() user: AuthUser) {
    return user;
  }
}
