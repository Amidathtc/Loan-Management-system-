import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FirebaseService } from '../firestore/firebase.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private firebaseService: FirebaseService) {}

  @ApiResponse({ 
    status: 200, 
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        uptime: { type: 'number', example: 123.456 },
        firebase: { type: 'string', example: 'connected' }
      }
    }
  })
  async check() {
    try {
      // Test Firestore connection
      await this.firebaseService.firestore.doc('health/check').get();
      
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        firebase: 'connected'
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        firebase: 'disconnected',
        error: error.message
      };
    }
  }
}