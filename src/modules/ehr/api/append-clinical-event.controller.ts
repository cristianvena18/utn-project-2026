import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { type AuthUser, Role } from '../../iam/domain/role';
import { CurrentUser } from '../../iam/api/current-user.decorator';
import { Roles } from '../../iam/api/roles.decorator';
import { AppendClinicalEventUseCase } from '../application/append-clinical-event.use-case';
import { ClinicalEventType } from '../domain/clinical-event';
import { AppendClinicalEventDto } from './dto/append-clinical-event.dto';

@ApiTags('ehr')
@ApiBearerAuth()
@Controller('ehr/patients/:patientId')
export class AppendClinicalEventController {
  constructor(private readonly appendEvent: AppendClinicalEventUseCase) {}

  @Post('events')
  @Roles(Role.ADMINISTRATOR, Role.DOCTOR)
  @ApiOperation({ summary: 'Append clinical event' })
  append(
    @Param('patientId', ParseIntPipe) patientId: number,
    @CurrentUser() user: AuthUser,
    @Body() dto: AppendClinicalEventDto,
  ) {
    const payload = { ...dto.payload };
    if (dto.type === ClinicalEventType.ALLERGY) {
      if (dto.substance) payload.substance = dto.substance;
      if (dto.severity) payload.severity = dto.severity;
    }
    return this.appendEvent.execute(patientId, user, {
      type: dto.type,
      payload,
    });
  }
}
