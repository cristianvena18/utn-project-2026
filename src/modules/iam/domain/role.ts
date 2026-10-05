export enum Role {
  ADMINISTRATOR = 'ADMINISTRATOR',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  RECEPTIONIST = 'RECEPTIONIST',
  PATIENT = 'PATIENT',
}

export type AuthUser = {
  id: number;
  email: string;
  name: string;
  role: Role;
};
