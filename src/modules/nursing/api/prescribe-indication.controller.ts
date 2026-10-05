import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { type AuthUser, Role } from '../../iam/domain/role';
import { CurrentUser } from '../../iam/api/current-user.decorator';
import { Roles } from '../../iam/api/roles.decorator';
import { PrescribeIndicationUseCase } from '../application/prescribe-indication.use-case';
import { PrescribeIndicationDto } from './dto/prescribe-indication.dto';

@ApiTags('nursing')
@ApiBearerAuth()
@Controller('nursing')
export class PrescribeIndicationController {
  constructor(private readonly prescribe: PrescribeIndicationUseCase) {}

  @Post('patients/:patientId/indications')
  @Roles(Role.ADMINISTRATOR, Role.DOCTOR)
  @ApiOperation({ summary: 'Prescribe indication' })
  create(
    @Param('patientId', ParseIntPipe) patientId: number,
    @CurrentUser() user: AuthUser,
    @Body() dto: PrescribeIndicationDto,
  ) {
    return this.prescribe.execute(patientId, user, dto.description);
  }
}
