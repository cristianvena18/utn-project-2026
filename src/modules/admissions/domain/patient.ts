export enum InsuranceType {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
  UNINSURED = 'UNINSURED',
}

export type PatientRecord = {
  id: number;
  nationalId: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  insuranceType: InsuranceType;
  insuranceName: string | null;
  userId: number | null;
};
