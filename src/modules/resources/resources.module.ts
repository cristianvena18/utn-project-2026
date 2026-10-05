import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdmissionsModule } from '../admissions/admissions.module';
import { AssignBedController } from './api/assign-bed.controller';
import { BlockBedController } from './api/block-bed.controller';
import { ConfirmCleaningController } from './api/confirm-cleaning.controller';
import { DeductSupplyController } from './api/deduct-supply.controller';
import { DischargeBedController } from './api/discharge-bed.controller';
import { ListBedsController } from './api/list-beds.controller';
import { ListPharmacyAlertsController } from './api/list-pharmacy-alerts.controller';
import { ListSuppliesController } from './api/list-supplies.controller';
import { SevereAllergyPharmacySubscriber } from './api/severe-allergy-pharmacy.subscriber';
import { UnblockBedController } from './api/unblock-bed.controller';
import { AssignBedUseCase } from './application/assign-bed.use-case';
import { BlockBedUseCase } from './application/block-bed.use-case';
import { ConfirmCleaningUseCase } from './application/confirm-cleaning.use-case';
import { DeductSupplyUseCase } from './application/deduct-supply.use-case';
import { DischargeBedUseCase } from './application/discharge-bed.use-case';
import { ListBedsUseCase } from './application/list-beds.use-case';
import { ListPharmacyAlertsUseCase } from './application/list-pharmacy-alerts.use-case';
import { ListSuppliesUseCase } from './application/list-supplies.use-case';
import { UnblockBedUseCase } from './application/unblock-bed.use-case';
import { BedStateMachine } from './domain/bed';
import {
  BED_REPOSITORY,
  PHARMACY_ALERT_REPOSITORY,
  SUPPLY_REPOSITORY,
} from './domain/ports/resources.repository';
import { BedOrmEntity } from './infrastructure/persistence/bed.orm-entity';
import { PharmacyAlertOrmEntity } from './infrastructure/persistence/pharmacy-alert.orm-entity';
import { SupplyMovementOrmEntity } from './infrastructure/persistence/supply-movement.orm-entity';
import { SupplyOrmEntity } from './infrastructure/persistence/supply.orm-entity';
import { TypeOrmBedRepository } from './infrastructure/persistence/type-orm-bed-repository';
import { TypeOrmPharmacyAlertRepository } from './infrastructure/persistence/type-orm-pharmacy-alert-repository';
import { TypeOrmSupplyRepository } from './infrastructure/persistence/type-orm-supply-repository';

@Module({
  imports: [
    AdmissionsModule,
    TypeOrmModule.forFeature([
      BedOrmEntity,
      SupplyOrmEntity,
      SupplyMovementOrmEntity,
      PharmacyAlertOrmEntity,
    ]),
  ],
  controllers: [
    ListBedsController,
    AssignBedController,
    DischargeBedController,
    ConfirmCleaningController,
    BlockBedController,
    UnblockBedController,
    ListSuppliesController,
    DeductSupplyController,
    ListPharmacyAlertsController,
  ],
  providers: [
    BedStateMachine,
    ListBedsUseCase,
    AssignBedUseCase,
    DischargeBedUseCase,
    ConfirmCleaningUseCase,
    BlockBedUseCase,
    UnblockBedUseCase,
    ListSuppliesUseCase,
    DeductSupplyUseCase,
    ListPharmacyAlertsUseCase,
    SevereAllergyPharmacySubscriber,
    { provide: BED_REPOSITORY, useClass: TypeOrmBedRepository },
    { provide: SUPPLY_REPOSITORY, useClass: TypeOrmSupplyRepository },
    {
      provide: PHARMACY_ALERT_REPOSITORY,
      useClass: TypeOrmPharmacyAlertRepository,
    },
  ],
})
export class ResourcesModule {}
