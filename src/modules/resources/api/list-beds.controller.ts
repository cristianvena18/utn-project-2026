import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '../../iam/domain/role';
import { Roles } from '../../iam/api/roles.decorator';
import { ListBedsUseCase } from '../application/list-beds.use-case';

@ApiTags('resources')
@ApiBearerAuth()
@Controller()
export class ListBedsController {
  constructor(private readonly listBeds: ListBedsUseCase) {}

  @Get('beds')
  @Roles(Role.ADMINISTRATOR, Role.RECEPTIONIST, Role.NURSE, Role.DOCTOR)
  @ApiOperation({ summary: 'Bed map' })
  list() {
    return this.listBeds.execute();
  }
}
