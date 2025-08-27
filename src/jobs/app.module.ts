import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { ScheduleModule } from '@nestjs/schedule';

import { validateConfig } from'../common/config/config.schema';
import { AppConfigService } from '../common/config/config.service';
import { FirebaseService } from '../common/firestore/firebase.service';
import { HealthController } from '../common/health/health.controller';
import { AuthModule } from '../modules/auth/auth.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateConfig,
      envFilePath: ['.env.local', '.env'],
    }),
    
    // Rate Limiting
    ThrottlerModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        throttlers: [{
          ttl: config.throttle.ttl * 1000, // Convert to milliseconds
          limit: config.throttle.limit,
        }],
      }),
    }),
    
    // Logging
    LoggerModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        pinoHttp: {
          level: config.logLevel,
          transport: config.isDevelopment ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
            },
          } : undefined,
          serializers: {
            req: (req) => ({
              method: req.method,
              url: req.url,
              headers: {
                'user-agent': req.headers['user-agent'],
                'authorization': req.headers.authorization ? '[REDACTED]' : undefined,
              },
            }),
            res: (res) => ({
              statusCode: res.statusCode,
            }),
          },
        },
      }),
    }),
    
    // Task Scheduling
    ScheduleModule.forRoot(),
    
    // Feature Modules
    AuthModule,
  ],
  controllers: [HealthController],
  providers: [
    AppConfigService,
    FirebaseService,
  ],
})
export class AppModule {}