export const BED_ASSIGNED = 'resources.bed-assigned';

export class BedAssignedEvent {
  constructor(
    readonly bedId: number,
    readonly patientId: number,
  ) {}
}
