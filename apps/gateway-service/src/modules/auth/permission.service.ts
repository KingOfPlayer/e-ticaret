import { Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class PermissionService {
  hasPermission(user: any, method: string, path: string): boolean {
    if (!user) {
      throw new ForbiddenException('User not identified');
    }

    // Admin has full access
    if (user.role === 'ADMIN') {
      return true;
    }

    // Regular users can only perform GET operations
    if (user.role === 'USER') {
      if (method === 'GET') {
        return true;
      }

      // Specifically deny POST/PUT/DELETE for sensitive paths like /api/products
      if (['POST', 'PUT', 'DELETE'].includes(method)) {
        throw new ForbiddenException(
          `User role ${user.role} cannot perform ${method} on ${path}`,
        );
      }
    }

    return true;
  }
}
