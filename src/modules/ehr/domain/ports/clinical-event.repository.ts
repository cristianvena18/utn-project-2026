import {
  AllergyRecord,
  ClinicalEventRecord,
  ClinicalEventType,
} from '../clinical-event';

export interface ClinicalEventRepository {
  append(input: {
    patientId: number;
    type: ClinicalEventType;
    payload: Record<string, unknown>;
    createdBy: number;
  }): Promise<ClinicalEventRecord>;
  listByPatient(patientId: number): Promise<ClinicalEventRecord[]>;
  addAllergy(input: {
    patientId: number;
    substance: string;
    severity: AllergyRecord['severity'];
    clinicalEventId: number;
  }): Promise<AllergyRecord>;
  listAllergies(patientId: number): Promise<AllergyRecord[]>;
}

export const CLINICAL_EVENT_REPOSITORY = Symbol.for(
  'PORT:ClinicalEventRepository',
);
