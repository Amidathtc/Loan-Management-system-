import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { AppConfigService } from '../config/config.service';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private firebaseApp: admin.app.App; // renamed this

  constructor(private configService: AppConfigService) {}

  async onModuleInit() {
    try {
      const firebaseConfig = this.configService.firebase;
      
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: firebaseConfig.projectId,
          clientEmail: firebaseConfig.clientEmail,
          privateKey: firebaseConfig.privateKey,
        }),
        projectId: firebaseConfig.projectId,
      });

      this.logger.log('Firebase Admin SDK initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin SDK', error.stack);
      throw error;
    }
  }

  get auth(): admin.auth.Auth {
    return this.firebaseApp.auth();
  }

  get firestore(): admin.firestore.Firestore {
    return this.firebaseApp.firestore();
  }

  get app(): admin.app.App {
    return this.firebaseApp; // return renamed property
  }
}
