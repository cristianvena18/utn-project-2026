import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '../../iam/domain/role';
import { Roles } from '../../iam/api/roles.decorator';
import { RegisterPatientUseCase } from '../application/register-patient.use-case';
import { RegisterPatientDto } from './dto/register-patient.dto';

@ApiTags('admissions')
@ApiBearerAuth()
@Controller()
export class RegisterPatientController {
  constructor(private readonly registerPatient: RegisterPatientUseCase) {}

  @Post('patients')
  @Roles(Role.ADMINISTRATOR, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Register patient' })
  create(@Body() dto: RegisterPatientDto) {
    return this.registerPatient.execute(dto);
  }
}
