import { BedStateMachine, BedStatus } from './bed';

describe('BedStateMachine', () => {
  const machine = new BedStateMachine();

  it('allows free to occupied and blocked', () => {
    expect(machine.canTransition(BedStatus.AVAILABLE, BedStatus.OCCUPIED)).toBe(
      true,
    );
    expect(machine.canTransition(BedStatus.AVAILABLE, BedStatus.BLOCKED)).toBe(
      true,
    );
  });

  it('rejects occupied to free', () => {
    expect(machine.canTransition(BedStatus.OCCUPIED, BedStatus.AVAILABLE)).toBe(
      false,
    );
  });
});
