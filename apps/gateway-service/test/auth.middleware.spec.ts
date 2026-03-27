import { JwtService } from '@nestjs/jwt';
import { AuthMiddleware } from '../src/common/middleware/auth.middleware';

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService({ secret: 'test-secret' });
    middleware = new AuthMiddleware(jwtService);
  });

  it('Processing a request containing JWT.', () => {
    const mockPayload = { userId: 1, role: 'admin' };
    const token = jwtService.sign(mockPayload);

    const mockReq = { headers: { authorization: `Bearer ${token}` } } as any;
    const mockRes = {} as any;
    const mockNext = jest.fn();

    middleware.use(mockReq, mockRes, mockNext);

    expect(mockReq.headers['x-user-id']).toBeDefined();
    expect(mockReq.headers['x-user-id']).toBe(1);
    expect(mockNext).toHaveBeenCalled();
  });

  it('Processing a request without JWT.', () => {
    const mockReq = { headers: {} } as any;
    const mockRes = {} as any;
    const mockNext = jest.fn();

    middleware.use(mockReq, mockRes, mockNext);

    expect(mockReq.headers['x-user-id']).toBeUndefined();
    expect(mockNext).toHaveBeenCalled();
  });

  it('It should remove x-user-id headers', () => {
    const mockReq = { headers: { 'x-user-id': '123', 'x-user-role': 'admin' } } as any;
    const mockRes = {} as any;
    const mockNext = jest.fn();

    middleware.use(mockReq, mockRes, mockNext);

    expect(mockReq.headers['x-user-id']).toBeUndefined();
    expect(mockReq.headers['x-user-role']).toBeUndefined();
  });
});
