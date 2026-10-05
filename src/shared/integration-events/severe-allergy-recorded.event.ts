export const SEVERE_ALLERGY_RECORDED = 'ehr.severe-allergy-recorded';

export class SevereAllergyRecordedEvent {
  constructor(
    readonly patientId: number,
    readonly substance: string,
  ) {}
}
