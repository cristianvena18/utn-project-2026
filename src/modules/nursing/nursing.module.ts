import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdmissionsModule } from '../admissions/admissions.module';
import { AddNursingNoteController } from './api/add-nursing-note.controller';
import { AdministerMedicationController } from './api/administer-medication.controller';
import { BuildCareProtocolController } from './api/build-care-protocol.controller';
import { ListNursingChartController } from './api/list-nursing-chart.controller';
import { PrescribeIndicationController } from './api/prescribe-indication.controller';
import { RecordVitalSignsController } from './api/record-vital-signs.controller';
import { SevereAllergyNursingSubscriber } from './api/severe-allergy-nursing.subscriber';
import { AddNursingNoteUseCase } from './application/add-nursing-note.use-case';
import { AdministerMedicationUseCase } from './application/administer-medication.use-case';
import { BuildCareProtocolUseCase } from './application/build-care-protocol.use-case';
import { ListNursingChartUseCase } from './application/list-nursing-chart.use-case';
import { PrescribeIndicationUseCase } from './application/prescribe-indication.use-case';
import { RecordVitalSignsUseCase } from './application/record-vital-signs.use-case';
import { NURSING_REPOSITORY } from './domain/ports/nursing.repository';
import { CareProtocolOrmEntity } from './infrastructure/persistence/care-protocol.orm-entity';
import { IndicationOrmEntity } from './infrastructure/persistence/indication.orm-entity';
import { MedicationAdministrationOrmEntity } from './infrastructure/persistence/medication-administration.orm-entity';
import { NursingNoteOrmEntity } from './infrastructure/persistence/nursing-note.orm-entity';
import { TypeOrmNursingRepository } from './infrastructure/persistence/typeorm-nursing.repository';
import { VitalSignOrmEntity } from './infrastructure/persistence/vital-sign.orm-entity';

@Module({
  imports: [
    AdmissionsModule,
    TypeOrmModule.forFeature([
      VitalSignOrmEntity,
      IndicationOrmEntity,
      MedicationAdministrationOrmEntity,
      NursingNoteOrmEntity,
      CareProtocolOrmEntity,
    ]),
  ],
  controllers: [
    ListNursingChartController,
    RecordVitalSignsController,
    PrescribeIndicationController,
    AdministerMedicationController,
    AddNursingNoteController,
    BuildCareProtocolController,
  ],
  providers: [
    RecordVitalSignsUseCase,
    PrescribeIndicationUseCase,
    AdministerMedicationUseCase,
    AddNursingNoteUseCase,
    BuildCareProtocolUseCase,
    ListNursingChartUseCase,
    SevereAllergyNursingSubscriber,
    { provide: NURSING_REPOSITORY, useClass: TypeOrmNursingRepository },
  ],
})
export class NursingModule {}
