import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { type AuthUser } from '../../iam/domain/role';
import {
  NURSING_REPOSITORY,
  type NursingRepository,
} from '../domain/ports/nursing.repository';

@Injectable()
export class AddNursingNoteUseCase {
  constructor(
    @Inject(NURSING_REPOSITORY) private readonly nursing: NursingRepository,
  ) {}

  execute(patientId: number, user: AuthUser, content: string) {
    return this.nursing.addNote({
      patientId,
      nurseId: user.id,
      content,
    });
  }
}
