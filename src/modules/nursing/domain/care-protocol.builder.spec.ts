import { AdmissionType, CareProtocolBuilder } from './care-protocol.builder';

describe('CareProtocolBuilder', () => {
  it('builds urgency protocol with extra precautions', () => {
    const protocol = new CareProtocolBuilder()
      .forAdmissionType(AdmissionType.EMERGENCY)
      .withAllergyPrecautions()
      .build();

    expect(protocol.steps[0]).toContain('EMERGENCY');
    expect(protocol.steps).toContain(
      'Allergy precautions and anaphylaxis kit available',
    );
  });
});
