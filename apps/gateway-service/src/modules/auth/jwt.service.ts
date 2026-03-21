import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtService {
  private readonly publicRoutes = ['/api/auth/login', '/api/auth/register'];
  private readonly mockSecret = 'super-secret-key';

  verifyToken(token: string): { userId: string; role: string } {
    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    if (token === 'valid-token') {
      return { userId: '123', role: 'USER' };
    }

    throw new UnauthorizedException('Invalid token');
  }

  isPublicRoute(path: string): boolean {
    return this.publicRoutes.some((route) => path.startsWith(route));
  }
}
