import {
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Remove x-user-id, x-user-email and x-user-role headers to prevent spoofing
    delete req.headers['x-user-id'];
    delete req.headers['x-user-role'];
    delete req.headers['x-user-email'];

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = this.jwtService.verify(token);

        req.headers['x-user-id'] = decoded.userId;
        req.headers['x-user-role'] = decoded.role;
        req.headers['x-user-email'] = decoded.email;
      } catch (err) {
        throw new UnauthorizedException('Invalid token');
      }
    }
    next();
  }
}

