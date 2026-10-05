import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '../../iam/domain/role';
import { Roles } from '../../iam/api/roles.decorator';
import { AssignBedUseCase } from '../application/assign-bed.use-case';
import { AssignBedDto } from './dto/assign-bed.dto';

@ApiTags('resources')
@ApiBearerAuth()
@Controller()
export class AssignBedController {
  constructor(private readonly assignBed: AssignBedUseCase) {}

  @Post('beds/:id/assign')
  @Roles(Role.ADMINISTRATOR, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Assign bed (optimistic locking)' })
  assign(@Param('id', ParseIntPipe) id: number, @Body() dto: AssignBedDto) {
    return this.assignBed.execute(id, dto.patientId);
  }
}
