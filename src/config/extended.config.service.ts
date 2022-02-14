import { Injectable } from '@nestjs/common';
import { ConfigService, Path, PathValue } from '@nestjs/config';
import { IEnvironmentVariables } from './env.types';

@Injectable()
/**
 * `ExtendedConfigService` enhances NestJS' default `ConfigService` to provide type-safe access to environment variables.
 */
export class ExtendedConfigService<
  K = IEnvironmentVariables,
> extends ConfigService<K, true> {
  public override get<P extends Path<K>>(path: P): PathValue<K, P> {
    const value = super.get(path, { infer: true });

    return value;
  }
}
