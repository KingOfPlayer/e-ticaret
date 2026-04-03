import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Route } from '../src/modules/resolver/schemas/route.schema';
import { ResolverService } from '../src/modules/resolver/resolver.service';

describe('RouteResolverService', () => {
  let service: ResolverService;
  let mongodbMonk: any;

  beforeEach(async () => {
    mongodbMonk = {
      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      }),
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      }),
      updateOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      }),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResolverService,
        {
          provide: getModelToken(Route.name),
          useValue: mongodbMonk,
        },
      ],
    }).compile();

    service = module.get<ResolverService>(ResolverService);
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

    const route = await service.resolveRoute('test');
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
    expect(mongodbMonk.findOne).toHaveBeenCalledWith({
      prefix: 'auth',
    });
    expect(mongodbMonk.findOne).toHaveBeenCalledWith({
      prefix: 'products',
    });
    expect(mongodbMonk.findOne).toHaveBeenCalledWith({
      prefix: 'orders',
    });
    expect(mongodbMonk.updateOne).toHaveBeenCalledWith(
      {
        prefix: 'auth',
      },
      {
        target: process.env.AUTH_SERVICE_URL || 'http://127.0.0.1:5001',
      },
    );
    expect(mongodbMonk.updateOne).toHaveBeenCalledWith(
      {
        prefix: 'products',
      },
      {
        target: process.env.PRODUCT_SERVICE_URL || 'http://127.0.0.1:5002',
      },
    );
    expect(mongodbMonk.updateOne).toHaveBeenCalledWith(
      {
        prefix: 'orders',
      },
      {
        target: process.env.ORDER_SERVICE_URL || 'http://127.0.0.1:5003',
      },
    );
  });

  it('should not seed routes if they already exist', async () => {
    mongodbMonk.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue([
        { prefix: 'auth', target: 'http://127.0.0.1:5001' },
        { prefix: 'products', target: 'http://127.0.0.1:5002' },
        { prefix: 'orders', target: 'http://127.0.0.1:5003' },
      ]),
    });

    await service.seedRoutes();
    expect(mongodbMonk.findOne).toHaveBeenCalledTimes(3);
    expect(mongodbMonk.updateOne).toHaveBeenCalledTimes(3);
  });

  it('should get available routes', async () => {
    const routesFromDb = [
      { prefix: 'test1', target: 'http://localhost:3001' },
      { prefix: 'test2', target: 'http://localhost:3002' },
    ];

    mongodbMonk.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue(routesFromDb),
    });

    const routes = await service.getAllRoutes();
    expect(routes).toEqual(routesFromDb);
  });
});
