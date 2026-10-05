import { AppointmentStatus, AppointmentStateMachine } from './appointment';

describe('AppointmentStateMachine', () => {
  const machine = new AppointmentStateMachine();

  it('allows SCHEDULED -> CONFIRMED and SCHEDULED -> CANCELLED', () => {
    expect(
      machine.canTransition(
        AppointmentStatus.SCHEDULED,
        AppointmentStatus.CONFIRMED,
      ),
    ).toBe(true);
    expect(
      machine.canTransition(
        AppointmentStatus.SCHEDULED,
        AppointmentStatus.CANCELLED,
      ),
    ).toBe(true);
  });

  it('rejects ATTENDED -> SCHEDULED', () => {
    expect(
      machine.canTransition(
        AppointmentStatus.ATTENDED,
        AppointmentStatus.SCHEDULED,
      ),
    ).toBe(false);
  });
});
