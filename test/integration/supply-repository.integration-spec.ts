import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsufficientStockException } from '../../src/shared/exceptions/insufficient-stock.exception';
import { SupplyMovementOrmEntity } from '../../src/modules/resources/infrastructure/persistence/supply-movement.orm-entity';
import { SupplyOrmEntity } from '../../src/modules/resources/infrastructure/persistence/supply.orm-entity';
import { TypeOrmSupplyRepository } from '../../src/modules/resources/infrastructure/persistence/type-orm-supply-repository';

// TEST DE INTEGRACIÓN
// La regla de stock vive en el SQL (`UPDATE ... WHERE stock >= :quantity`),
// así que un test unitario con mocks nunca podría probar que funciona.
// Solo una base de datos real puede.
describe('TypeOrmSupplyRepository (integration)', () => {
  let moduleRef: TestingModule;
  let repository: TypeOrmSupplyRepository;
  let supplies: Repository<SupplyOrmEntity>;
  let movements: Repository<SupplyMovementOrmEntity>;
  let gauzeId: number;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [SupplyOrmEntity, SupplyMovementOrmEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([SupplyOrmEntity, SupplyMovementOrmEntity]),
      ],
      providers: [TypeOrmSupplyRepository],
    }).compile();

    repository = moduleRef.get(TypeOrmSupplyRepository);
    supplies = moduleRef.get(getRepositoryToken(SupplyOrmEntity));
    movements = moduleRef.get(getRepositoryToken(SupplyMovementOrmEntity));
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  beforeEach(async () => {
    await movements.clear();
    await supplies.clear();
    const gauze = await supplies.save(
      supplies.create({ name: 'Gauze', stock: 10, unit: 'u' }),
    );
    gauzeId = gauze.id;
  });

  it('deducts stock when there is enough', async () => {
    const updated = await repository.deduct(gauzeId, 4);

    expect(updated.stock).toBe(6);
    expect((await supplies.findOneByOrFail({ id: gauzeId })).stock).toBe(6);
  });

  it('allows deducting exactly the remaining stock', async () => {
    const updated = await repository.deduct(gauzeId, 10);

    expect(updated.stock).toBe(0);
  });

  it('throws InsufficientStockException and leaves stock untouched', async () => {
    await expect(repository.deduct(gauzeId, 11)).rejects.toBeInstanceOf(
      InsufficientStockException,
    );

    expect((await supplies.findOneByOrFail({ id: gauzeId })).stock).toBe(10);
  });

  it('never goes negative under concurrent deductions', async () => {
    // Cinco pedidos de 3 unidades contra un stock de 10: solo 3 pueden salir bien.
    const results = await Promise.allSettled(
      Array.from({ length: 5 }, () => repository.deduct(gauzeId, 3)),
    );

    const ok = results.filter((r) => r.status === 'fulfilled');
    expect(ok).toHaveLength(3);
    expect((await supplies.findOneByOrFail({ id: gauzeId })).stock).toBe(1);
  });

  it('records a supply movement', async () => {
    await repository.addMovement({
      supplyId: gauzeId,
      quantity: 2,
      patientId: 5,
    });

    const rows = await movements.find();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      supplyId: gauzeId,
      quantity: 2,
      patientId: 5,
    });
  });
});
