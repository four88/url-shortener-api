import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  private apiKey: string;
  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.getOrThrow('apiKeys');
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const key = this.extractApiKey(request);
    if (key !== this.apiKey) {
      throw new UnauthorizedException('Invalid API key');
    }
    return true;
  }

  private extractApiKey(request: Request) {
    const key = request.headers['x-api-key'];
    if (!key) return false;
    return key;
  }
}
