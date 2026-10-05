import { BedStateMachine, BedStatus } from './bed';

// TEST UNITARIO (dominio puro)
// Sin Nest, sin base de datos, sin mocks: solo una clase y sus entradas/salidas.
// Es el tipo de test más rápido y simple.
describe('BedStateMachine', () => {
  const machine = new BedStateMachine();

  // it.each ejecuta el mismo test una vez por fila: así la tabla completa
  // de transiciones queda legible sin copiar y pegar asserts.
  it.each([
    [BedStatus.AVAILABLE, BedStatus.OCCUPIED],
    [BedStatus.AVAILABLE, BedStatus.BLOCKED],
    [BedStatus.OCCUPIED, BedStatus.CLEANING],
    [BedStatus.CLEANING, BedStatus.AVAILABLE],
    [BedStatus.BLOCKED, BedStatus.AVAILABLE],
  ])('allows %s -> %s', (from, to) => {
    expect(machine.canTransition(from, to)).toBe(true);
  });

  it.each([
    [BedStatus.OCCUPIED, BedStatus.AVAILABLE],
    [BedStatus.OCCUPIED, BedStatus.BLOCKED],
    [BedStatus.CLEANING, BedStatus.OCCUPIED],
    [BedStatus.BLOCKED, BedStatus.OCCUPIED],
    [BedStatus.AVAILABLE, BedStatus.CLEANING],
  ])('rejects %s -> %s', (from, to) => {
    expect(machine.canTransition(from, to)).toBe(false);
  });
});
