import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose'; // Import this
import { RouteResolverService } from '../src/modules/gateway/route-resolver.service';
import { Route } from '../src/modules/gateway/schemas/route.schema';

describe('RouteResolverService', () => {
  let service: RouteResolverService;
  let mongodbMonk: any;

  beforeEach(async () => {
    mongodbMonk = {
      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      }),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RouteResolverService,
        {
          provide: getModelToken(Route.name),
          useValue: mongodbMonk,
        },
      ],
    }).compile();

    service = module.get<RouteResolverService>(RouteResolverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return empty route for non-existing path', async () => {
    mongodbMonk.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

    const route = await service.resolveRoute('non-existing-path');
    expect(route).toEqual(null);
  });

  it('should add routes to the database', async () => {
    const newRoute = {
      prefix: 'test',
      target: 'http://localhost:3000',
    };

    await service.addRoute(newRoute);
    expect(mongodbMonk.create).toHaveBeenCalledWith(newRoute);
  });

  it('should resolve route for existing path', async () => {
    const existingRoute = {
      prefix: 'test',
      target: 'http://localhost:3000',
    };

    mongodbMonk.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue([existingRoute]),
    });

    const route = await service.resolveRoute('test/some-path');
    expect(route).toEqual(existingRoute);
  });

  it('should return empty route for non-matching path', async () => {
    const existingRoute = {
      prefix: 'test',
      target: 'http://localhost:3000',
    };

    mongodbMonk.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue([existingRoute]),
    });

    const route = await service.resolveRoute('non-matching-path');
    expect(route).toEqual(null);
  });

  it('should update route table from database', async () => {
    const routesFromDb = [
      { prefix: 'test1', target: 'http://localhost:3001' },
      { prefix: 'test2', target: 'http://localhost:3002' },
    ];

    mongodbMonk.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue(routesFromDb),
    });

    await service.refleshRoutes();
    expect(service['cachedRoutes']).toEqual(routesFromDb);
  });

  it('should route seeding', async () => {
    await service.seedRoutes();
    expect(mongodbMonk.create).toHaveBeenCalledWith({ prefix: '/api/auth', target: process.env.AUTH_SERVICE_URL || 'http://localhost:5001' });
    expect(mongodbMonk.create).toHaveBeenCalledWith({ prefix: '/api/products', target: process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002' });
    expect(mongodbMonk.create).toHaveBeenCalledWith({ prefix: '/api/orders', target: process.env.ORDER_SERVICE_URL || 'http://localhost:5003' });
  });

  it('should not seed routes if they already exist', async () => {

    mongodbMonk.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue([
        { prefix: '/api/auth', target: 'http://localhost:5001' },
        { prefix: '/api/products', target: 'http://localhost:5002' },
        { prefix: '/api/orders', target: 'http://localhost:5003' },
      ]),
    });

    await service.seedRoutes();
    expect(mongodbMonk.find).toHaveBeenCalled();
    expect(mongodbMonk.create).not.toHaveBeenCalled();
  });
});