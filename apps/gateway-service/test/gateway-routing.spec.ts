import { Test, TestingModule } from '@nestjs/testing';
import { RouteResolverService } from '../src/modules/gateway/route-resolver.service';

describe('GatewayRouting (Red Phase)', () => {
  let service: RouteResolverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RouteResolverService],
    }).compile();

    service = module.get<RouteResolverService>(RouteResolverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should resolve /api/auth to auth-service', () => {
    const target = service.resolveService('/api/auth/login');
    expect(target).toBe('http://auth-service:3000');
  });

  it('should resolve /api/products to product-service', () => {
    const target = service.resolveService('/api/products');
    expect(target).toBe('http://product-service:3000');
  });

  it('should resolve /api/orders to order-service', () => {
    const target = service.resolveService('/api/orders/my-orders');
    expect(target).toBe('http://order-service:3000');
  });

  it('should throw Error for unknown route', () => {
    expect(() => service.resolveService('/api/unknown')).toThrow();
  });
});
