export const ROUTE_MAP: { [key: string]: string } = {
  '/api/auth': process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
  '/api/products': process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002',
  '/api/orders': process.env.ORDER_SERVICE_URL || 'http://localhost:5003',
  '/api/admin/orders': process.env.ORDER_SERVICE_URL || 'http://localhost:5003',
  '/api/admin/logs': process.env.LOGS_SERVICE_URL || 'http://localhost:5000/log',
};
