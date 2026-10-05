import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamModule } from '../iam/iam.module';
import { BookAppointmentController } from './api/book-appointment.controller';
import { GetPatientController } from './api/get-patient.controller';
import { ListAppointmentsController } from './api/list-appointments.controller';
import { ListPatientsController } from './api/list-patients.controller';
import { RegisterPatientController } from './api/register-patient.controller';
import { TransitionAppointmentController } from './api/transition-appointment.controller';
import { BookAppointmentUseCase } from './application/book-appointment.use-case';
import { GetPatientUseCase } from './application/get-patient.use-case';
import { ListAppointmentsUseCase } from './application/list-appointments.use-case';
import { ListPatientsUseCase } from './application/list-patients.use-case';
import { RegisterPatientUseCase } from './application/register-patient.use-case';
import { TransitionAppointmentUseCase } from './application/transition-appointment.use-case';
import { AppointmentStateMachine } from './domain/appointment';
import { APPOINTMENT_REPOSITORY } from './domain/ports/appointment.repository';
import { PATIENT_REPOSITORY } from './domain/ports/patient.repository';
import { AppointmentOrmEntity } from './infrastructure/persistence/appointment.orm-entity';
import { PatientOrmEntity } from './infrastructure/persistence/patient.orm-entity';
import { TypeOrmAppointmentRepository } from './infrastructure/persistence/typeorm-appointment.repository';
import { TypeOrmPatientRepository } from './infrastructure/persistence/typeorm-patient.repository';

@Module({
  imports: [
    IamModule,
    TypeOrmModule.forFeature([PatientOrmEntity, AppointmentOrmEntity]),
  ],
  controllers: [
    RegisterPatientController,
    ListPatientsController,
    GetPatientController,
    BookAppointmentController,
    ListAppointmentsController,
    TransitionAppointmentController,
  ],
  providers: [
    AppointmentStateMachine,
    RegisterPatientUseCase,
    ListPatientsUseCase,
    GetPatientUseCase,
    BookAppointmentUseCase,
    ListAppointmentsUseCase,
    TransitionAppointmentUseCase,
    { provide: PATIENT_REPOSITORY, useClass: TypeOrmPatientRepository },
    { provide: APPOINTMENT_REPOSITORY, useClass: TypeOrmAppointmentRepository },
  ],
  exports: [PATIENT_REPOSITORY],
})
export class AdmissionsModule {}
