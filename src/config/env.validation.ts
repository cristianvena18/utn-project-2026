import { plainToInstance } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { IsInt } from 'class-validator';
import { IsNotEmpty } from 'class-validator';
import { IsString } from 'class-validator';
import { Max } from 'class-validator';
import { Min } from 'class-validator';
import { validateSync } from 'class-validator';

export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv = NodeEnv.Development;

  @IsInt()
  @Min(1)
  @Max(65535)
  PORT: number = 3002;

  @IsString()
  @IsNotEmpty()
  DB_PATH: string = 'data/app.sqlite';

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string = 'dev-hospital-secret-change-me';

  @IsInt()
  @Min(60)
  JWT_EXPIRES_SECONDS: number = 86400;
}

export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
    exposeDefaultValues: true,
  });

  const errors = validateSync(validated, {
    skipMissingProperties: false,
    whitelist: true,
    forbidNonWhitelisted: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validated;
}
