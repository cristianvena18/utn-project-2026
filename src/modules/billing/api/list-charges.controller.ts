import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '../../iam/domain/role';
import { Roles } from '../../iam/api/roles.decorator';
import { ListChargesUseCase } from '../application/list-charges.use-case';

@ApiTags('billing')
@ApiBearerAuth()
@Roles(Role.ADMINISTRATOR, Role.RECEPTIONIST)
@Controller('billing')
export class ListChargesController {
  constructor(private readonly listCharges: ListChargesUseCase) {}

  @Get('charges')
  @ApiOperation({ summary: 'Charges (optional patientId filter)' })
  list(@Query('patientId') patientId?: string) {
    return this.listCharges.execute(patientId ? Number(patientId) : undefined);
  }
}
