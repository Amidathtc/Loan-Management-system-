import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import * as admin from "firebase-admin";

@Injectable()
export class FirebaseStrategy extends PassportStrategy(
  Strategy,
  "firebase-auth"
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: () => {
        return admin.apps.length ? admin.app().options.projectId : null; // or use your Firebase project ID here
      },
      passReqToCallback: true,
    });
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(), // or cert from your Firebase JSON
      });
    }
  }

  async validate(payload: any) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(payload);
      return decodedToken;
    } catch {
      throw new UnauthorizedException("Invalid Firebase token");
    }
  }
}
