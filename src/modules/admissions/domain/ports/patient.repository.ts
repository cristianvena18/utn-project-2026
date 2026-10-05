import { type PatientRecord } from '../patient';

export interface PatientRepository {
  create(input: Omit<PatientRecord, 'id'>): Promise<PatientRecord>;
  findById(id: number): Promise<PatientRecord | null>;
  findByNationalId(nationalId: string): Promise<PatientRecord | null>;
  list(): Promise<PatientRecord[]>;
}

export const PATIENT_REPOSITORY = Symbol.for('PORT:PatientRepository');
