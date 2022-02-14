import { Injectable } from '@nestjs/common';
import { ExtendedConfigService } from './config/extended.config.service';

@Injectable()
export class AppService {
  constructor(private readonly configService: ExtendedConfigService) {}
  getHello(): string {
    return this.configService.get('WIZARDS_CONTRACT');
  }
}
