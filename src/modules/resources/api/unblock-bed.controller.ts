import { Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '../../iam/domain/role';
import { Roles } from '../../iam/api/roles.decorator';
import { UnblockBedUseCase } from '../application/unblock-bed.use-case';

@ApiTags('resources')
@ApiBearerAuth()
@Controller()
export class UnblockBedController {
  constructor(private readonly unblockBed: UnblockBedUseCase) {}

  @Post('beds/:id/unblock')
  @Roles(Role.ADMINISTRATOR, Role.RECEPTIONIST)
  unblock(@Param('id', ParseIntPipe) id: number) {
    return this.unblockBed.execute(id);
  }
}
