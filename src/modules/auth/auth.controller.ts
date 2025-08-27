import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

//   @Get('me')
//   @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'Current user information',
    schema: {
      type: 'object',
      properties: {
        uid: { type: 'string', example: 'firebase-uid-123' },
        email: { type: 'string', example: 'user@example.com' },
        role: { type: 'string', example: 'credit_officer' },
        displayName: { type: 'string', example: 'John Doe' }
      }
    }
  })
  @ApiBearerAuth()
  async getMe() {
    // Stub implementation - will be completed in Step 2
    return {
      uid: 'stub-uid',
      email: 'stub@example.com',
      role: 'credit_officer',
      displayName: 'Stub User',
      message: 'This is a stub endpoint - will be implemented with Firebase Auth'
    };
  }
}