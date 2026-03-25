import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/user.role.decorator';
import { UserRole } from '../decorators/user.role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();

    const userId = request.headers['x-user-id'];
    const userRolesHeader = request.headers['x-user-role'];

    const userRoles = userRolesHeader
      ? (userRolesHeader
          .split(',')
          .map((role: string) => role.trim()) as UserRole[])
      : [];

    if (!userId || !userRoles.length) {
      throw new UnauthorizedException(
        'Unauthorized: User information is missing in the request headers.',
      );
    }

    if (!requiredRoles) {
      return true;
    }

    const hasRole = requiredRoles.some((role) => userRoles.includes(role));
    if (!hasRole) {
      throw new ForbiddenException(
        'Unauthorized: You are not authorized to perform this action.',
      );
    }

    return true;
  }
}
