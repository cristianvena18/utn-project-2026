import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdmissionsModule } from '../admissions/admissions.module';
import { AppendClinicalEventController } from './api/append-clinical-event.controller';
import { ListClinicalRecordController } from './api/list-clinical-record.controller';
import { AppendClinicalEventUseCase } from './application/append-clinical-event.use-case';
import { ListClinicalRecordUseCase } from './application/list-clinical-record.use-case';
import { CLINICAL_EVENT_REPOSITORY } from './domain/ports/clinical-event.repository';
import { AllergyOrmEntity } from './infrastructure/persistence/allergy.orm-entity';
import { ClinicalEventOrmEntity } from './infrastructure/persistence/clinical-event.orm-entity';
import { TypeOrmClinicalEventRepository } from './infrastructure/persistence/typeorm-clinical-event.repository';

@Module({
  imports: [
    AdmissionsModule,
    TypeOrmModule.forFeature([ClinicalEventOrmEntity, AllergyOrmEntity]),
  ],
  controllers: [ListClinicalRecordController, AppendClinicalEventController],
  providers: [
    AppendClinicalEventUseCase,
    ListClinicalRecordUseCase,
    {
      provide: CLINICAL_EVENT_REPOSITORY,
      useClass: TypeOrmClinicalEventRepository,
    },
  ],
})
export class EhrModule {}
