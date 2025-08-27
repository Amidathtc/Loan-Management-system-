import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { AppConfigService } from '../common/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Get configuration service
  const configService = app.get(AppConfigService);

  // Use Pino logger
  app.useLogger(app.get(Logger));

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip non-whitelisted properties
    forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
    transform: true, // Transform payloads to be objects typed according to their DTO classes
    transformOptions: {
      enableImplicitConversion: true, // Allow implicit type conversion
    },
  }));

  // CORS - configure based on environment
  app.enableCors({
    origin: configService.isDevelopment ? true : /^https:\/\/.*\.yourdomain\.com$/,
    credentials: true,
  });

  // Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Loan Management System API')
    .setDescription('A comprehensive loan management system with role-based access control')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Firebase ID Token',
        in: 'header',
      },
      'firebase-auth',
    )
    .addTag('Authentication', 'Authentication and user management')
    .addTag('Health', 'Health check endpoints')
    .addTag('Users', 'User management')
    .addTag('Branches', 'Branch management')
    .addTag('Loans', 'Loan management')
    .addTag('Repayments', 'Repayment tracking')
    .addTag('Reports', 'Reports and analytics')
    .addTag('Admin', 'Administrative functions')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  const port = configService.port;
  await app.listen(port);

  const logger = app.get(Logger);
  logger.log(`🚀 Server running on http://localhost:${port}`, 'Bootstrap');
  logger.log(`📚 API Documentation available at http://localhost:${port}/docs`, 'Bootstrap');
  logger.log(`🔍 Health check available at http://localhost:${port}/api/v1/health`, 'Bootstrap');
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});