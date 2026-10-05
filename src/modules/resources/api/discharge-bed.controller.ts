import { Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '../../iam/domain/role';
import { Roles } from '../../iam/api/roles.decorator';
import { DischargeBedUseCase } from '../application/discharge-bed.use-case';

@ApiTags('resources')
@ApiBearerAuth()
@Controller()
export class DischargeBedController {
  constructor(private readonly dischargeBed: DischargeBedUseCase) {}

  @Post('beds/:id/discharge')
  @Roles(Role.ADMINISTRATOR, Role.DOCTOR, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Discharge: bed to cleaning' })
  discharge(@Param('id', ParseIntPipe) id: number) {
    return this.dischargeBed.execute(id);
  }
}
