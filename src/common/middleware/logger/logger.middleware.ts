import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggerService } from '../../../core/logger/logger.service';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}
  use(req: Request, res: Response, next: () => void) {
    res.on('finish', () => {
      const { statusCode } = res;
      const { url, method } = req;
      const logData = {
        url,
        method,
      };
      const logMessage = `${method} ${url} ${statusCode}`;

      if (statusCode === 500) {
        this.logger.error(logMessage, undefined, 'HTTP', logData);
      }
      if (statusCode >= 400 && statusCode < 500) {
        this.logger.warn(logMessage, 'HTTP', logData);
      } else {
        this.logger.log(logMessage, 'HTTP', logData);
      }
    });
    next();
  }
}
