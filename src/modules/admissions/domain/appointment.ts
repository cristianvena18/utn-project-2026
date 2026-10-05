export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  WAITING_ROOM = 'WAITING_ROOM',
  ATTENDED = 'ATTENDED',
  CANCELLED = 'CANCELLED',
}

export enum TriageLevel {
  RED = 'RED',
  ORANGE = 'ORANGE',
  YELLOW = 'YELLOW',
  GREEN = 'GREEN',
  BLUE = 'BLUE',
}

export type AppointmentRecord = {
  id: number;
  patientId: number;
  doctorId: number;
  scheduledAt: string;
  status: AppointmentStatus;
  triageLevel: TriageLevel | null;
  version: number;
};

const ALLOWED: Record<AppointmentStatus, AppointmentStatus[]> = {
  [AppointmentStatus.SCHEDULED]: [
    AppointmentStatus.CONFIRMED,
    AppointmentStatus.CANCELLED,
  ],
  [AppointmentStatus.CONFIRMED]: [
    AppointmentStatus.WAITING_ROOM,
    AppointmentStatus.CANCELLED,
  ],
  [AppointmentStatus.WAITING_ROOM]: [AppointmentStatus.ATTENDED],
  [AppointmentStatus.ATTENDED]: [],
  [AppointmentStatus.CANCELLED]: [],
};

export class AppointmentStateMachine {
  canTransition(from: AppointmentStatus, to: AppointmentStatus): boolean {
    return ALLOWED[from].includes(to);
  }
}
