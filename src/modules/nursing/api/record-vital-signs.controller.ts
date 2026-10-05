import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { type AuthUser, Role } from '../../iam/domain/role';
import { CurrentUser } from '../../iam/api/current-user.decorator';
import { Roles } from '../../iam/api/roles.decorator';
import { RecordVitalSignsUseCase } from '../application/record-vital-signs.use-case';
import { RecordVitalSignsDto } from './dto/record-vital-signs.dto';

@ApiTags('nursing')
@ApiBearerAuth()
@Controller('nursing')
export class RecordVitalSignsController {
  constructor(private readonly recordVitals: RecordVitalSignsUseCase) {}

  @Post('patients/:patientId/vitals')
  @Roles(Role.ADMINISTRATOR, Role.NURSE)
  @ApiOperation({ summary: 'Record vital signs' })
  record(
    @Param('patientId', ParseIntPipe) patientId: number,
    @CurrentUser() user: AuthUser,
    @Body() dto: RecordVitalSignsDto,
  ) {
    return this.recordVitals.execute(patientId, user, dto);
  }
}
