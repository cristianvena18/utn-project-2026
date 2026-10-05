import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { type AuthUser, Role } from '../../iam/domain/role';
import { CurrentUser } from '../../iam/api/current-user.decorator';
import { Roles } from '../../iam/api/roles.decorator';
import { AdministerMedicationUseCase } from '../application/administer-medication.use-case';
import { AdministerMedicationDto } from './dto/administer-medication.dto';

@ApiTags('nursing')
@ApiBearerAuth()
@Controller('nursing')
export class AdministerMedicationController {
  constructor(private readonly administer: AdministerMedicationUseCase) {}

  @Post('indications/:id/administer')
  @Roles(Role.ADMINISTRATOR, Role.NURSE)
  @ApiOperation({ summary: 'Administer medication for an indication' })
  administerMedication(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
    @Body() dto: AdministerMedicationDto,
  ) {
    return this.administer.execute(id, user, dto.notes);
  }
}
