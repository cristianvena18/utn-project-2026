export const MEDICATION_ADMINISTERED = 'nursing.medication-administered';

export class MedicationAdministeredEvent {
  constructor(
    readonly administrationId: number,
    readonly patientId: number,
  ) {}
}
