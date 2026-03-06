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

  it('should allow ADMIN to access product creation', () => {
    const hasPermission = service.checkPermission('ADMIN', '/api/products', 'POST');
    expect(hasPermission).toBe(true);
  });

  it('should deny USER to access product creation', () => {
    expect(() => service.checkPermission('USER', '/api/products', 'POST')).toThrow(ForbiddenException);
  });

  it('should allow USER to access their own orders', () => {
    const hasPermission = service.checkPermission('USER', '/api/orders', 'GET');
    expect(hasPermission).toBe(true);
  });

  it('should deny USER to access admin logs', () => {
    expect(() => service.checkPermission('USER', '/api/admin/logs', 'GET')).toThrow(ForbiddenException);
  });
});
