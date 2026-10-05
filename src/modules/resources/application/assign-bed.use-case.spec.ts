import type { EventEmitter2 } from '@nestjs/event-emitter';
import { InvalidTransitionException } from '../../../shared/exceptions/invalid-transition.exception';
import { ResourceNotFoundException } from '../../../shared/exceptions/resource-not-found.exception';
import { BED_ASSIGNED } from '../../../shared/integration-events/bed-assigned.event';
import type { PatientRepository } from '../../admissions/domain/ports/patient.repository';
import { BedRecord, BedStateMachine, BedStatus } from '../domain/bed';
import type { BedRepository } from '../domain/ports/resources.repository';
import { AssignBedUseCase } from './assign-bed.use-case';

// TEST UNITARIO (capa de aplicación, con mocks)
// El use case depende de ports (interfaces). Los reemplazamos por mocks de
// Jest para que el test verifique SOLO la lógica de orquestación: sin base
// de datos, sin HTTP, sin contenedor de Nest. Los objetos de dominio reales
// (BedStateMachine) se usan tal cual porque son puros y rápidos.
describe('AssignBedUseCase', () => {
  const availableBed: BedRecord = {
    id: 1,
    code: '101',
    status: BedStatus.AVAILABLE,
    patientId: null,
    blockReason: null,
    version: 1,
  };

  // Cada método del port es un jest.fn() independiente: así podemos definir
  // qué devuelve y después verificar cómo fue llamado.
  const findBed = jest.fn<Promise<BedRecord | null>, [number]>();
  const saveBed = jest.fn<Promise<BedRecord>, [BedRecord]>();
  const findPatient = jest.fn<Promise<{ id: number } | null>, [number]>();
  const emit = jest.fn();

  let useCase: AssignBedUseCase;

  beforeEach(() => {
    // Se resetean entre tests para que ninguno arrastre estado de otro.
    jest.resetAllMocks();

    const beds: BedRepository = {
      list: jest.fn(),
      findById: findBed,
      save: saveBed,
    };
    const patients = { findById: findPatient } as unknown as PatientRepository;
    const events = { emit } as unknown as EventEmitter2;

    useCase = new AssignBedUseCase(
      beds,
      patients,
      new BedStateMachine(),
      events,
    );
  });

  it('occupies an available bed and emits BED_ASSIGNED', async () => {
    // Arrange (preparar)
    findBed.mockResolvedValue(availableBed);
    findPatient.mockResolvedValue({ id: 7 });
    saveBed.mockImplementation((bed) => Promise.resolve(bed));

    // Act (ejecutar)
    const result = await useCase.execute(1, 7);

    // Assert (verificar): valor devuelto, interacción con el port y efecto secundario
    expect(result.status).toBe(BedStatus.OCCUPIED);
    expect(result.patientId).toBe(7);
    expect(saveBed).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        status: BedStatus.OCCUPIED,
        version: 1,
      }),
    );
    expect(emit).toHaveBeenCalledWith(
      BED_ASSIGNED,
      expect.objectContaining({ bedId: 1, patientId: 7 }),
    );
  });

  it('throws ResourceNotFoundException when the bed does not exist', async () => {
    findBed.mockResolvedValue(null);

    await expect(useCase.execute(99, 7)).rejects.toBeInstanceOf(
      ResourceNotFoundException,
    );
    // Si falla temprano, no debería haber pasado nada más.
    expect(saveBed).not.toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalled();
  });

  it('throws ResourceNotFoundException when the patient does not exist', async () => {
    findBed.mockResolvedValue(availableBed);
    findPatient.mockResolvedValue(null);

    await expect(useCase.execute(1, 99)).rejects.toBeInstanceOf(
      ResourceNotFoundException,
    );
    expect(saveBed).not.toHaveBeenCalled();
  });

  it('throws InvalidTransitionException when the bed is already occupied', async () => {
    findBed.mockResolvedValue({
      ...availableBed,
      status: BedStatus.OCCUPIED,
      patientId: 3,
    });
    findPatient.mockResolvedValue({ id: 7 });

    await expect(useCase.execute(1, 7)).rejects.toBeInstanceOf(
      InvalidTransitionException,
    );
    expect(saveBed).not.toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalled();
  });
});
