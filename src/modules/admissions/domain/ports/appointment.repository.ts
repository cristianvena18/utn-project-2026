import {
  AppointmentRecord,
  AppointmentStatus,
  TriageLevel,
} from '../appointment';

export interface AppointmentRepository {
  create(input: {
    patientId: number;
    doctorId: number;
    scheduledAt: string;
  }): Promise<AppointmentRecord>;
  findById(id: number): Promise<AppointmentRecord | null>;
  list(): Promise<AppointmentRecord[]>;
  updateStatus(
    appointment: AppointmentRecord,
    status: AppointmentStatus,
    triageLevel?: TriageLevel | null,
  ): Promise<AppointmentRecord>;
}

export const APPOINTMENT_REPOSITORY = Symbol.for('PORT:AppointmentRepository');
