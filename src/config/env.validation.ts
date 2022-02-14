import { ConfigModule } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import {
  IsEthereumAddress,
  IsNumber,
  IsString,
  IsUrl,
  validateSync,
  ValidationError,
} from 'class-validator';
import { IEnvironmentVariables } from './env.types';

export class EnvironmentVariables implements IEnvironmentVariables {
  /* General ENV */
  @IsUrl({ protocols: ['postgresql'], require_tld: false, require_port: true })
  DATABASE_URL: string;

  /* Contract ENV */
  @IsNumber()
  CHAIN_ID: number;

  @IsEthereumAddress()
  BOOK_OF_LORE_CONTRACT: string;
  @IsNumber()
  BOOK_OF_LORE_FIRST_BLOCK: number;

  @IsEthereumAddress()
  WIZARDS_CONTRACT: string;
  @IsNumber()
  WIZARDS_FIRST_BLOCK: number;

  @IsEthereumAddress()
  SOULS_CONTRACT: string;
  @IsNumber()
  SOULS_FIRST_BLOCK: number;
  @IsUrl()
  SOULS_BASE_URL: string;

  @IsEthereumAddress()
  PONIES_CONTRACT: string;
  @IsNumber()
  PONIES_FIRST_BLOCK: number;
  @IsUrl()
  PONIES_BASE_URL: string;

  @IsUrl()
  IPFS_SERVER: string;

  /* Discord ENV */
  @IsString()
  DISCORD_TOKEN: string;
  @IsString()
  CHANNEL_ID: string;
}

export function validateEnvVariables(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validateConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validateConfig, {
    skipMissingProperties: false,
    stopAtFirstError: true,
    forbidUnknownValues: true,
  });

  if (errors.length > 0) {
    const parsedErrors = errors.flatMap((error: ValidationError) =>
      Object.values(error.constraints ?? {}),
    );
    const beautifiedErrors = parsedErrors.toString().replace(/,/g, '\n * ');
    throw new Error(`ENV validation failed \n * ${beautifiedErrors} \n`);
  }

  return validateConfig;
}

export const EnvVariableValidation = ConfigModule.forRoot({
  validate: validateEnvVariables,
  cache: true,
  expandVariables: true,
});
