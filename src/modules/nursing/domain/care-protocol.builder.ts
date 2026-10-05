export enum AdmissionType {
  EMERGENCY = 'EMERGENCY',
  SCHEDULED = 'SCHEDULED',
  OBSERVATION = 'OBSERVATION',
}

export enum IndicationStatus {
  PENDING = 'PENDING',
  ADMINISTERED = 'ADMINISTERED',
}

export class CareProtocolBuilder {
  private readonly steps: string[] = [];

  forAdmissionType(type: AdmissionType): this {
    this.steps.push(`Admission type ${type}`);
    if (type === AdmissionType.EMERGENCY) {
      this.steps.push(
        'Immediate triage',
        'Vital signs every 15 minutes',
        'IV access',
        'Notify the on-call doctor',
      );
    } else if (type === AdmissionType.OBSERVATION) {
      this.steps.push(
        'Vital signs every 30 minutes',
        'Pain control',
        'Reassessment in 2 hours',
      );
    } else {
      this.steps.push(
        'Vital signs on admission',
        'Confirm medical orders',
        'Patient education',
      );
    }
    return this;
  }

  withMedicationMonitoring(): this {
    this.steps.push('Medication monitoring and adverse reactions');
    return this;
  }

  withAllergyPrecautions(): this {
    this.steps.push('Allergy precautions and anaphylaxis kit available');
    return this;
  }

  build(): { steps: string[] } {
    return { steps: [...this.steps] };
  }
}
