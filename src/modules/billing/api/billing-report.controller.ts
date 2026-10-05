import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '../../iam/domain/role';
import { Roles } from '../../iam/api/roles.decorator';
import { BillingReportUseCase } from '../application/billing-report.use-case';

@ApiTags('billing')
@ApiBearerAuth()
@Roles(Role.ADMINISTRATOR, Role.RECEPTIONIST)
@Controller('billing')
export class BillingReportController {
  constructor(private readonly report: BillingReportUseCase) {}

  @Get('report')
  @ApiOperation({ summary: 'Administrative billing report' })
  summary() {
    return this.report.execute();
  }
}
