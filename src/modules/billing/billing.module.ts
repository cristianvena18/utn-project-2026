import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdmissionsModule } from '../admissions/admissions.module';
import { AppointmentAttendedBillingSubscriber } from './api/appointment-attended-billing.subscriber';
import { BedAssignedBillingSubscriber } from './api/bed-assigned-billing.subscriber';
import { BillingReportController } from './api/billing-report.controller';
import { ListChargesController } from './api/list-charges.controller';
import { MedicationAdministeredBillingSubscriber } from './api/medication-administered-billing.subscriber';
import { BillingReportUseCase } from './application/billing-report.use-case';
import { ListChargesUseCase } from './application/list-charges.use-case';
import { RegisterChargeUseCase } from './application/register-charge.use-case';
import { BillingStrategyFactory } from './domain/billing-strategy.factory';
import { CHARGE_REPOSITORY } from './domain/ports/charge.repository';
import { ChargeOrmEntity } from './infrastructure/persistence/charge.orm-entity';
import { TypeOrmChargeRepository } from './infrastructure/persistence/typeorm-charge.repository';

@Module({
  imports: [AdmissionsModule, TypeOrmModule.forFeature([ChargeOrmEntity])],
  controllers: [ListChargesController, BillingReportController],
  providers: [
    BillingStrategyFactory,
    RegisterChargeUseCase,
    AppointmentAttendedBillingSubscriber,
    BedAssignedBillingSubscriber,
    MedicationAdministeredBillingSubscriber,
    ListChargesUseCase,
    BillingReportUseCase,
    { provide: CHARGE_REPOSITORY, useClass: TypeOrmChargeRepository },
  ],
})
export class BillingModule {}
