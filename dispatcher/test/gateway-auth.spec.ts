import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '../src/modules/auth/jwt.service';
import { UnauthorizedException } from '@nestjs/common';

describe('GatewayAuth (Red Phase)', () => {
  let service: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtService],
    }).compile();

    service = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate a correct token', () => {
    const mockToken = 'valid-token';
    const mockPayload = { userId: '123', role: 'USER' };
    
    // This will fail because verifyToken is not implemented
    const payload = service.verifyToken(mockToken);
    expect(payload).toEqual(mockPayload);
  });

  it('should throw UnauthorizedException for missing token', () => {
    expect(() => service.verifyToken('')).toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException for invalid token', () => {
    expect(() => service.verifyToken('invalid-token')).toThrow(UnauthorizedException);
  });

  it('should identify public routes (no token required)', () => {
    expect(service.isPublicRoute('/api/auth/login')).toBe(true);
    expect(service.isPublicRoute('/api/auth/register')).toBe(true);
    expect(service.isPublicRoute('/api/products')).toBe(false);
  });
});
