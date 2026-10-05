import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { type AuthUser, Role } from '../../iam/domain/role';
import { CurrentUser } from '../../iam/api/current-user.decorator';
import { Roles } from '../../iam/api/roles.decorator';
import { BuildCareProtocolUseCase } from '../application/build-care-protocol.use-case';
import { BuildProtocolDto } from './dto/build-protocol.dto';

@ApiTags('nursing')
@ApiBearerAuth()
@Controller('nursing')
export class BuildCareProtocolController {
  constructor(private readonly buildProtocol: BuildCareProtocolUseCase) {}

  @Post('patients/:patientId/protocols')
  @Roles(Role.ADMINISTRATOR, Role.NURSE, Role.DOCTOR)
  @ApiOperation({ summary: 'Build care protocol (Builder)' })
  create(
    @Param('patientId', ParseIntPipe) patientId: number,
    @CurrentUser() user: AuthUser,
    @Body() dto: BuildProtocolDto,
  ) {
    return this.buildProtocol.execute(patientId, user, dto);
  }
}
