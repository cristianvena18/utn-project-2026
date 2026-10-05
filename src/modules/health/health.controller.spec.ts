import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing';
import { HealthCheckService } from '@nestjs/terminus';
import { MemoryHealthIndicator } from '@nestjs/terminus';
import { TypeOrmHealthIndicator } from '@nestjs/terminus';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;
  const health = { check: jest.fn() };
  const memory = { checkHeap: jest.fn() };
  const db = { pingCheck: jest.fn() };

  beforeEach(async () => {
    health.check.mockReset();
    memory.checkHeap.mockReset();
    db.pingCheck.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useValue: health },
        { provide: MemoryHealthIndicator, useValue: memory },
        { provide: TypeOrmHealthIndicator, useValue: db },
      ],
    }).compile();

    controller = module.get(HealthController);
  });

  it('runs memory and database health indicators', async () => {
    health.check.mockImplementation((indicators: Array<() => unknown>) => {
      indicators.forEach((indicator) => indicator());
      return Promise.resolve({ status: 'ok' });
    });

    await expect(controller.check()).resolves.toEqual({ status: 'ok' });
    expect(memory.checkHeap).toHaveBeenCalledWith(
      'memory_heap',
      512 * 1024 * 1024,
    );
    expect(db.pingCheck).toHaveBeenCalledWith('database');
  });
});
