export enum BedStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  CLEANING = 'CLEANING',
  BLOCKED = 'BLOCKED',
}

export type BedRecord = {
  id: number;
  code: string;
  status: BedStatus;
  patientId: number | null;
  blockReason: string | null;
  version: number;
};

const ALLOWED: Record<BedStatus, BedStatus[]> = {
  [BedStatus.AVAILABLE]: [BedStatus.OCCUPIED, BedStatus.BLOCKED],
  [BedStatus.OCCUPIED]: [BedStatus.CLEANING],
  [BedStatus.CLEANING]: [BedStatus.AVAILABLE],
  [BedStatus.BLOCKED]: [BedStatus.AVAILABLE],
};

export class BedStateMachine {
  canTransition(from: BedStatus, to: BedStatus): boolean {
    return ALLOWED[from].includes(to);
  }
}

export type SupplyRecord = {
  id: number;
  name: string;
  stock: number;
  unit: string;
};
