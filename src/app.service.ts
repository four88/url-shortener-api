import { Injectable } from '@nestjs/common';
import { LoggerService } from './core/logger/logger.service';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  private context = 'AppService';
  constructor(
    private readonly loggerService: LoggerService, // @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  getHello(): string {
    this.loggerService.log('Hello World!', this.context, {
      userId: 123,
      isPremium: true,
    });
    return 'Hello World!';
  }
}
