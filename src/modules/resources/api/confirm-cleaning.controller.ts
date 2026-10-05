import { Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '../../iam/domain/role';
import { Roles } from '../../iam/api/roles.decorator';
import { ConfirmCleaningUseCase } from '../application/confirm-cleaning.use-case';

@ApiTags('resources')
@ApiBearerAuth()
@Controller()
export class ConfirmCleaningController {
  constructor(private readonly confirmCleaning: ConfirmCleaningUseCase) {}

  @Post('beds/:id/clean')
  @Roles(Role.ADMINISTRATOR, Role.NURSE)
  @ApiOperation({ summary: 'Confirm cleaning' })
  clean(@Param('id', ParseIntPipe) id: number) {
    return this.confirmCleaning.execute(id);
  }
}
