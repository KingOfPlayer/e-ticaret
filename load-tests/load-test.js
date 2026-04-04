import http from 'k6/http';
import { check, group, sleep } from 'k6';

const TEST_DATA = {
  auth: {
    user: { email: 'user@ecosystem.com', password: 'user123' },
  },
};


function getHeaders(token = null, includeContentType = true) {
  const headers = {};
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}


const target = parseInt(__ENV.TARGET || '50', 10);

export const options = {
  stages: [
    { duration: '30s', target },       
    { duration: '1m', target },        
    { duration: '30s', target: 0 },    
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.05'],
  },
};

const BASE_URL = 'http://localhost:5000/api';

export default function () {
  
  const userType = Math.random();

  // Product View %60
  if (userType < 0.6) {
    group('Scenario: Product Discovery', function () {
      const res = http.get(`${BASE_URL}/products`);
      check(res, { 'Product list status 200': (r) => r.status === 200 });
      sleep(1);
    });
  }

  // Login + Order Check %30
  else if (userType < 0.9) { // Kullanıcıların %30'u işlem yapsın
    group('Scenario: Order Workflow & Detail Check', function () {
      const loginRes = http.post(
        `${BASE_URL}/auth/login`,
        JSON.stringify(TEST_DATA.auth.user),
        { headers: getHeaders() }
      );

      sleep(1);

      if (check(loginRes, { 'Login Success': (r) => r.status === 200 })) {
        const token = loginRes.json('access_token');
        const authHeaders = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

        // 2. Siparişleri Listele (Dispatcher üzerinden Order Service'e) 
        const listRes = http.get(`${BASE_URL}/orders`, { headers: authHeaders });

        if (check(listRes, { 'Orders retrieved': (r) => r.status === 200 })) {
          const orders = listRes.json();

          // Order Detail Check %50
          if (Array.isArray(orders) && orders.length > 0) {
            // Kullanıcıların %50'si en son siparişinin detayına baksın
            if (Math.random() > 0.5) {
              const orderId = orders[Math.floor(Math.random() * orders.length)]._id || orders[Math.floor(Math.random() * orders.length)].id;

              group('Sub-Scenario: Order Detail Check', function () {

                sleep(1);
                const detailRes = http.get(`${BASE_URL}/orders/${orderId}`, { headers: authHeaders });

                check(detailRes, {
                  'Order detail status 200': (r) => r.status === 200,
                  'Correct order returned': (r) => r.body.includes(orderId),
                });
              });
            }
          }
        }
        sleep(1);
      }
    });
  }

  // Bot Test %10
  else { 
    group('Scenario: Security Check', function () {
      const unauthorizedRes = http.get(`${BASE_URL}/orders/admin/all`, { responseCallback: http.expectedStatuses(401, 403) });
      check(unauthorizedRes, {
        'Unauthorized access blocked (401/403)': (r) => r.status === 401 || r.status === 403,
      });
      sleep(1);
    });
  }
}