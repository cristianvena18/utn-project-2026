import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '../../iam/domain/role';
import { Roles } from '../../iam/api/roles.decorator';
import { ListNursingChartUseCase } from '../application/list-nursing-chart.use-case';

@ApiTags('nursing')
@ApiBearerAuth()
@Controller('nursing')
export class ListNursingChartController {
  constructor(private readonly listChart: ListNursingChartUseCase) {}

  @Get('patients/:patientId')
  @Roles(Role.ADMINISTRATOR, Role.DOCTOR, Role.NURSE)
  @ApiOperation({ summary: 'Chart: vitals and notes' })
  chart(@Param('patientId', ParseIntPipe) patientId: number) {
    return this.listChart.execute(patientId);
  }
}
