import { AdmissionType, IndicationStatus } from '../care-protocol.builder';

export type VitalSignRecord = {
  id: number;
  patientId: number;
  recordedBy: number;
  systolic: number;
  diastolic: number;
  heartRate: number;
  temperature: number;
  spo2: number;
  createdAt: Date;
};

export type IndicationRecord = {
  id: number;
  patientId: number;
  prescribedBy: number;
  description: string;
  status: IndicationStatus;
};

export type NursingNoteRecord = {
  id: number;
  patientId: number;
  nurseId: number;
  content: string;
  createdAt: Date;
};

export type CareProtocolRecord = {
  id: number;
  patientId: number;
  admissionType: AdmissionType;
  steps: string[];
};

export type MedicationAdministrationRecord = {
  id: number;
  indicationId: number;
  patientId: number;
  nurseId: number;
  notes: string | null;
};

export interface NursingRepository {
  addVitalSigns(
    input: Omit<VitalSignRecord, 'id' | 'createdAt'>,
  ): Promise<VitalSignRecord>;
  listVitalSigns(patientId: number): Promise<VitalSignRecord[]>;
  addIndication(
    input: Omit<IndicationRecord, 'id' | 'status'>,
  ): Promise<IndicationRecord>;
  findIndication(id: number): Promise<IndicationRecord | null>;
  markIndicationExecuted(id: number): Promise<void>;
  addAdministration(
    input: Omit<MedicationAdministrationRecord, 'id'>,
  ): Promise<MedicationAdministrationRecord>;
  addNote(
    input: Omit<NursingNoteRecord, 'id' | 'createdAt'>,
  ): Promise<NursingNoteRecord>;
  listNotes(patientId: number): Promise<NursingNoteRecord[]>;
  addProtocol(input: {
    patientId: number;
    admissionType: AdmissionType;
    steps: string[];
    createdBy: number;
  }): Promise<CareProtocolRecord>;
}

export const NURSING_REPOSITORY = Symbol.for('PORT:NursingRepository');
