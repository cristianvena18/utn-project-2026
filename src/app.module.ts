import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validateEnv } from './config/env.validation';
import { DatabaseModule } from './infrastructure/database/database.module';
import { SeedService } from './infrastructure/seed/seed.service';
import { AdmissionsModule } from './modules/admissions/admissions.module';
import { PatientOrmEntity } from './modules/admissions/infrastructure/persistence/patient.orm-entity';
import { BillingModule } from './modules/billing/billing.module';
import { EhrModule } from './modules/ehr/ehr.module';
import { HealthModule } from './modules/health/health.module';
import { IamModule } from './modules/iam/iam.module';
import { UserOrmEntity } from './modules/iam/infrastructure/persistence/user.orm-entity';
import { NursingModule } from './modules/nursing/nursing.module';
import { ResourcesModule } from './modules/resources/resources.module';
import { BedOrmEntity } from './modules/resources/infrastructure/persistence/bed.orm-entity';
import { SupplyOrmEntity } from './modules/resources/infrastructure/persistence/supply.orm-entity';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    EventEmitterModule.forRoot(),
    SharedModule,
    DatabaseModule,
    TypeOrmModule.forFeature([
      UserOrmEntity,
      PatientOrmEntity,
      BedOrmEntity,
      SupplyOrmEntity,
    ]),
    HealthModule,
    IamModule,
    AdmissionsModule,
    EhrModule,
    NursingModule,
    ResourcesModule,
    BillingModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule {}
