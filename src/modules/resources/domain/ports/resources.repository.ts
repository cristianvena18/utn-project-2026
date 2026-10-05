import { BedRecord, BedStatus, SupplyRecord } from '../bed';

export interface BedRepository {
  list(): Promise<BedRecord[]>;
  findById(id: number): Promise<BedRecord | null>;
  save(bed: BedRecord): Promise<BedRecord>;
}

export const BED_REPOSITORY = Symbol.for('PORT:BedRepository');

export interface SupplyRepository {
  list(): Promise<SupplyRecord[]>;
  findById(id: number): Promise<SupplyRecord | null>;
  deduct(id: number, quantity: number): Promise<SupplyRecord>;
  addMovement(input: {
    supplyId: number;
    quantity: number;
    patientId: number | null;
  }): Promise<void>;
}

export const SUPPLY_REPOSITORY = Symbol.for('PORT:SupplyRepository');

export interface PharmacyAlertRepository {
  add(input: {
    patientId: number;
    substance: string;
    message: string;
  }): Promise<void>;
  list(): Promise<
    Array<{
      id: number;
      patientId: number;
      substance: string;
      message: string;
    }>
  >;
}

export const PHARMACY_ALERT_REPOSITORY = Symbol.for(
  'PORT:PharmacyAlertRepository',
);

export type { BedStatus };
