import { describe, it, expect, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PermissionService } from '../src/modules/auth/permission.service';
import { ForbiddenException } from '@nestjs/common';

describe('GatewayRole (Red Phase)', () => {
  let service: PermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionService],
    }).compile();

    service = module.get<PermissionService>(PermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should allow ADMIN to POST products', () => {
    const user = { role: 'ADMIN' };
    const canAccess = service.hasPermission(user, 'POST', '/api/products');
    expect(canAccess).toBe(true);
  });

  it('should deny USER to POST products', () => {
    const user = { role: 'USER' };
    expect(() => service.hasPermission(user, 'POST', '/api/products'))
      .toThrow(ForbiddenException);
  });
});
