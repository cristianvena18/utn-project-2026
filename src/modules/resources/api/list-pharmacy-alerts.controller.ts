import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '../../iam/domain/role';
import { Roles } from '../../iam/api/roles.decorator';
import { ListPharmacyAlertsUseCase } from '../application/list-pharmacy-alerts.use-case';

@ApiTags('resources')
@ApiBearerAuth()
@Controller()
export class ListPharmacyAlertsController {
  constructor(private readonly listAlerts: ListPharmacyAlertsUseCase) {}

  @Get('pharmacy/alerts')
  @Roles(Role.ADMINISTRATOR, Role.NURSE, Role.DOCTOR)
  @ApiOperation({ summary: 'Pharmacy alerts (severe allergy observer)' })
  list() {
    return this.listAlerts.execute();
  }
}
