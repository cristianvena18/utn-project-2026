import { AppointmentStatus, AppointmentStateMachine } from './appointment';

describe('AppointmentStateMachine', () => {
  const machine = new AppointmentStateMachine();

  it.each([
    [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED],
    [AppointmentStatus.SCHEDULED, AppointmentStatus.CANCELLED],
  ])('allows %s -> %s', (from, to) => {
    const allowed = machine.canTransition(from, to);

    expect(allowed).toBe(true);
  });

  it('rejects ATTENDED -> SCHEDULED', () => {
    const allowed = machine.canTransition(
      AppointmentStatus.ATTENDED,
      AppointmentStatus.SCHEDULED,
    );

    expect(allowed).toBe(false);
  });
});
