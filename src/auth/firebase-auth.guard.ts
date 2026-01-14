import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";

@Injectable()
export class FirebaseAuthGuard extends AuthGuard("firebase-auth") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Allow public routes without auth if you add a @Public() decorator; else enforce auth
    return super.canActivate(context);
  }
}
