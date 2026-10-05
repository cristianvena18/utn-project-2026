import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mkdirSync } from 'fs';
import { dirname } from 'path';
import { isAbsolute } from 'path';
import { join } from 'path';
import { EnvironmentVariables, NodeEnv } from '../../config/env.validation';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvironmentVariables, true>) => ({
        type: 'better-sqlite3' as const,
        database: resolveDatabase(config),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}

function resolveDatabase(
  config: ConfigService<EnvironmentVariables, true>,
): string {
  if (config.get('NODE_ENV', { infer: true }) === NodeEnv.Test) {
    return ':memory:';
  }

  const configured = config.get('DB_PATH', { infer: true });
  const resolved = isAbsolute(configured)
    ? configured
    : join(process.cwd(), configured);
  mkdirSync(dirname(resolved), { recursive: true });
  return resolved;
}
