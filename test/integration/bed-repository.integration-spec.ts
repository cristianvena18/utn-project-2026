import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OptimisticLockException } from '../../src/shared/exceptions/optimistic-lock.exception';
import { BedStatus } from '../../src/modules/resources/domain/bed';
import { BedOrmEntity } from '../../src/modules/resources/infrastructure/persistence/bed.orm-entity';
import { TypeOrmBedRepository } from '../../src/modules/resources/infrastructure/persistence/type-orm-bed-repository';

// TEST DE INTEGRACIÓN
// A diferencia de un test unitario, acá no se mockea nada: el repositorio
// TypeORM real habla con una base SQLite real (en memoria, así es rápida y
// descartable). Verifica que nuestro adapter y la base funcionen juntos:
// SQL, mapeo de entidades y el @VersionColumn del optimistic locking.
// A diferencia de un e2e, no hay HTTP, auth ni AppModule completo: solo las
// piezas que este adapter necesita.
describe('TypeOrmBedRepository (integration)', () => {
  let moduleRef: TestingModule;
  let repository: TypeOrmBedRepository;
  let orm: Repository<BedOrmEntity>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [BedOrmEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([BedOrmEntity]),
      ],
      providers: [TypeOrmBedRepository],
    }).compile();

    repository = moduleRef.get(TypeOrmBedRepository);
    orm = moduleRef.get(getRepositoryToken(BedOrmEntity));
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  beforeEach(async () => {
    // Cada test arranca desde un estado conocido.
    await orm.clear();
    await orm.save(
      orm.create({ code: '101', status: BedStatus.AVAILABLE, patientId: null }),
    );
  });

  it('maps rows to domain records', async () => {
    const [bed] = await repository.list();

    expect(bed).toMatchObject({
      code: '101',
      status: BedStatus.AVAILABLE,
      patientId: null,
      blockReason: null,
      version: 1,
    });
  });

  it('persists changes and increments the version', async () => {
    const [bed] = await repository.list();

    const saved = await repository.save({
      ...bed,
      status: BedStatus.OCCUPIED,
      patientId: 7,
    });

    expect(saved.version).toBe(bed.version + 1);
    // Se relee desde la base, no desde el objeto devuelto.
    const reloaded = await repository.findById(bed.id);
    expect(reloaded?.status).toBe(BedStatus.OCCUPIED);
    expect(reloaded?.patientId).toBe(7);
  });

  it('rejects a save based on a stale version (optimistic lock)', async () => {
    // Dos usuarios leen la misma cama en la versión 1.
    const [userA] = await repository.list();
    const userB = { ...userA };

    // El usuario A guarda primero: la versión pasa a 2.
    await repository.save({
      ...userA,
      status: BedStatus.OCCUPIED,
      patientId: 1,
    });

    // El usuario B todavía tiene la versión 1, así que la escritura se rechaza.
    await expect(
      repository.save({ ...userB, status: BedStatus.BLOCKED }),
    ).rejects.toBeInstanceOf(OptimisticLockException);

    const final = await repository.findById(userA.id);
    expect(final?.status).toBe(BedStatus.OCCUPIED);
  });
});
