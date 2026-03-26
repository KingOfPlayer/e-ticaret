import { JwtService } from '@nestjs/jwt';

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

    expect(mockReq.user).toBeDefined();
    expect(mockReq.user.userId).toBe(1);
    expect(mockNext).toHaveBeenCalled();
  });

  it('Processing a request without JWT.', () => {
    const mockReq = { headers: {} } as any;
    const mockRes = {} as any;
    const mockNext = jest.fn();

    middleware.use(mockReq, mockRes, mockNext);

    expect(mockReq.user).toBeUndefined();
    expect(mockNext).toHaveBeenCalled();
  });
});