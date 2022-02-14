import { Module } from '@nestjs/common';
import { ExtendedConfigService } from './extended.config.service';

@Module({
  providers: [ExtendedConfigService],
  exports: [ExtendedConfigService],
})
export class ConfigModule {}
