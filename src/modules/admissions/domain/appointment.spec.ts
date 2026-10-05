import { AppointmentStatus, AppointmentStateMachine } from './appointment';

describe('AppointmentStateMachine', () => {
  const machine = new AppointmentStateMachine();

  it('allows programado to confirmado and cancelado', () => {
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

  it('rejects attended back to scheduled', () => {
    expect(
      machine.canTransition(
        AppointmentStatus.ATTENDED,
        AppointmentStatus.SCHEDULED,
      ),
    ).toBe(false);
  });
});
