import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '../../iam/domain/role';
import { Roles } from '../../iam/api/roles.decorator';
import { ListPatientsUseCase } from '../application/list-patients.use-case';

@ApiTags('admissions')
@ApiBearerAuth()
@Controller()
export class ListPatientsController {
  constructor(private readonly listPatients: ListPatientsUseCase) {}

  @Get('patients')
  @Roles(Role.ADMINISTRATOR, Role.RECEPTIONIST, Role.DOCTOR, Role.NURSE)
  @ApiOperation({ summary: 'List patients' })
  list() {
    return this.listPatients.execute();
  }
}
