export enum ClinicalEventType {
  ALLERGY = 'ALLERGY',
  FAMILY_HISTORY = 'FAMILY_HISTORY',
  EVOLUTION = 'EVOLUTION',
  STUDY = 'STUDY',
}

export enum AllergySeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
}

export type ClinicalEventRecord = {
  id: number;
  patientId: number;
  type: ClinicalEventType;
  payload: Record<string, unknown>;
  createdBy: number;
  createdAt: Date;
};

export type AllergyRecord = {
  id: number;
  patientId: number;
  substance: string;
  severity: AllergySeverity;
  clinicalEventId: number;
};
