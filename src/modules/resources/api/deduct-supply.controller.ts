import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '../../iam/domain/role';
import { Roles } from '../../iam/api/roles.decorator';
import { DeductSupplyUseCase } from '../application/deduct-supply.use-case';
import { DeductSupplyDto } from './dto/deduct-supply.dto';

@ApiTags('resources')
@ApiBearerAuth()
@Controller()
export class DeductSupplyController {
  constructor(private readonly deductSupply: DeductSupplyUseCase) {}

  @Post('supplies/:id/deduct')
  @Roles(Role.ADMINISTRATOR, Role.NURSE)
  @ApiOperation({ summary: 'Deduct stock atomically' })
  deduct(@Param('id', ParseIntPipe) id: number, @Body() dto: DeductSupplyDto) {
    return this.deductSupply.execute(id, dto.quantity, dto.patientId);
  }
}
