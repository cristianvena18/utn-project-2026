import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '../../iam/domain/role';
import { Roles } from '../../iam/api/roles.decorator';
import { ListSuppliesUseCase } from '../application/list-supplies.use-case';

@ApiTags('resources')
@ApiBearerAuth()
@Controller()
export class ListSuppliesController {
  constructor(private readonly listSupplies: ListSuppliesUseCase) {}

  @Get('supplies')
  @Roles(Role.ADMINISTRATOR, Role.NURSE, Role.DOCTOR)
  list() {
    return this.listSupplies.execute();
  }
}
