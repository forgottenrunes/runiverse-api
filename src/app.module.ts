import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { EnvVariableValidation } from './config/env.validation';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [EnvVariableValidation, ConfigModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
