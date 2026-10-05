import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import {
  BED_REPOSITORY,
  type BedRepository,
} from '../domain/ports/resources.repository';

@Injectable()
export class ListBedsUseCase {
  constructor(@Inject(BED_REPOSITORY) private readonly beds: BedRepository) {}
  execute() {
    return this.beds.list();
  }
}
