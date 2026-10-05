import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '../../iam/domain/role';
import { Roles } from '../../iam/api/roles.decorator';
import { BlockBedUseCase } from '../application/block-bed.use-case';
import { BlockBedDto } from './dto/block-bed.dto';

@ApiTags('resources')
@ApiBearerAuth()
@Controller()
export class BlockBedController {
  constructor(private readonly blockBed: BlockBedUseCase) {}

  @Post('beds/:id/block')
  @Roles(Role.ADMINISTRATOR, Role.RECEPTIONIST)
  block(@Param('id', ParseIntPipe) id: number, @Body() dto: BlockBedDto) {
    return this.blockBed.execute(id, dto.reason);
  }
}
