import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { Config } from './config.schema';

@Injectable()
export class AppConfigService {
  constructor(private configService: NestConfigService<Config>) {}

  get port(): number {
    return this.configService.get('PORT', { infer: true })!;
  }

  get nodeEnv(): string {
    return this.configService.get('NODE_ENV', { infer: true })!;
  }

  get firebase() {
    return {
      projectId: this.configService.get('FIREBASE_PROJECT_ID', { infer: true })!,
      clientEmail: this.configService.get('FIREBASE_CLIENT_EMAIL', { infer: true })!,
      privateKey: this.configService
        .get('FIREBASE_PRIVATE_KEY', { infer: true })!
        .replace(/\\n/g, '\n'),
    };
  }

  get throttle() {
    return {
      ttl: this.configService.get('THROTTLE_TTL', { infer: true })!,
      limit: this.configService.get('THROTTLE_LIMIT', { infer: true })!,
    };
  }

  get logLevel(): string {
    return this.configService.get('LOG_LEVEL', { infer: true })!;
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }
}
