export const APPOINTMENT_ATTENDED = 'admissions.appointment-attended';

export class AppointmentAttendedEvent {
  constructor(
    readonly appointmentId: number,
    readonly patientId: number,
  ) {}
}
