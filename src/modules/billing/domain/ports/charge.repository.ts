import { InsuranceType } from '../../../admissions/domain/patient';

export type ChargeRecord = {
  id: number;
  patientId: number;
  concept: string;
  baseAmount: number;
  billedAmount: number;
  insuranceType: InsuranceType;
  strategy: string;
  sourceType: string;
  sourceId: number;
  createdAt: Date;
};

export interface ChargeRepository {
  create(input: Omit<ChargeRecord, 'id' | 'createdAt'>): Promise<ChargeRecord>;
  list(): Promise<ChargeRecord[]>;
  listByPatient(patientId: number): Promise<ChargeRecord[]>;
}

export const CHARGE_REPOSITORY = Symbol.for('PORT:ChargeRepository');
