import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../iam/api/public.decorator';
import { HealthCheck } from '@nestjs/terminus';
import { HealthCheckService } from '@nestjs/terminus';
import { MemoryHealthIndicator } from '@nestjs/terminus';
import { TypeOrmHealthIndicator } from '@nestjs/terminus';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
    private readonly db: TypeOrmHealthIndicator,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Memory and database health check' })
  check() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 512 * 1024 * 1024),
      () => this.db.pingCheck('database'),
    ]);
  }
}
