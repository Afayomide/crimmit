import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken'; 

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const decodedToken = jwt.decode(token); 
      request.user = decodedToken; 
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  extractToken(request): string | null {
    const authorizationHeader = request.headers.authorization;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      return authorizationHeader.split(' ')[1];
    }
    return null;
  }
}
