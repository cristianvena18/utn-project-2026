import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { type AuthUser, Role } from '../../iam/domain/role';
import { CurrentUser } from '../../iam/api/current-user.decorator';
import { Roles } from '../../iam/api/roles.decorator';
import { AddNursingNoteUseCase } from '../application/add-nursing-note.use-case';
import { NursingNoteDto } from './dto/nursing-note.dto';

@ApiTags('nursing')
@ApiBearerAuth()
@Controller('nursing')
export class AddNursingNoteController {
  constructor(private readonly addNote: AddNursingNoteUseCase) {}

  @Post('patients/:patientId/notes')
  @Roles(Role.ADMINISTRATOR, Role.NURSE)
  @ApiOperation({ summary: 'Nursing note' })
  create(
    @Param('patientId', ParseIntPipe) patientId: number,
    @CurrentUser() user: AuthUser,
    @Body() dto: NursingNoteDto,
  ) {
    return this.addNote.execute(patientId, user, dto.content);
  }
}
