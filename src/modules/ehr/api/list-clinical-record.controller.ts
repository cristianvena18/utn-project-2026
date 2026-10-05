import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '../../iam/domain/role';
import { Roles } from '../../iam/api/roles.decorator';
import { ListClinicalRecordUseCase } from '../application/list-clinical-record.use-case';

@ApiTags('ehr')
@ApiBearerAuth()
@Controller('ehr/patients/:patientId')
export class ListClinicalRecordController {
  constructor(private readonly listRecord: ListClinicalRecordUseCase) {}

  @Get()
  @Roles(Role.ADMINISTRATOR, Role.DOCTOR, Role.NURSE, Role.PATIENT)
  @ApiOperation({ summary: 'Clinical record (immutable events)' })
  get(@Param('patientId', ParseIntPipe) patientId: number) {
    return this.listRecord.execute(patientId);
  }
}
