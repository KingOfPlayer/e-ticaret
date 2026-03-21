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
    expect(target).toBe(process.env.AUTH_SERVICE_URL || 'http://localhost:5001');
  });

  it('should resolve /api/products to product-service', () => {
    const target = service.resolveService('/api/products');
    expect(target).toBe(process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002');
  });

  it('should resolve /api/orders to order-service', () => {
    const target = service.resolveService('/api/orders/my-orders');
    expect(target).toBe(process.env.ORDER_SERVICE_URL || 'http://localhost:5003');
  });

  it('should throw Error for unknown route', () => {
    expect(() => service.resolveService('/api/unknown')).toThrow();
  });
});
