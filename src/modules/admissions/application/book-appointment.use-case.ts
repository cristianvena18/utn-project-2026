import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundException } from '../../../shared/exceptions/resource-not-found.exception';
import { Role } from '../../iam/domain/role';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../iam/domain/ports/user.repository';
import {
  APPOINTMENT_REPOSITORY,
  type AppointmentRepository,
} from '../domain/ports/appointment.repository';
import {
  PATIENT_REPOSITORY,
  type PatientRepository,
} from '../domain/ports/patient.repository';

@Injectable()
export class BookAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointments: AppointmentRepository,
    @Inject(PATIENT_REPOSITORY) private readonly patients: PatientRepository,
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(input: {
    patientId: number;
    doctorId: number;
    scheduledAt: string;
  }) {
    const patient = await this.patients.findById(input.patientId);
    if (!patient) {
      throw new ResourceNotFoundException('Patient', input.patientId);
    }
    const doctor = await this.users.findById(input.doctorId);
    if (!doctor || doctor.role !== Role.DOCTOR) {
      throw new ResourceNotFoundException('Doctor', input.doctorId);
    }
    return this.appointments.create(input);
  }
}
