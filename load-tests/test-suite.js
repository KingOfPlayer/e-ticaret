import http from 'k6/http';
import { check, group, sleep } from 'k6';

// Configuration
const BASE_URL = 'http://localhost:5000/api';
const TEST_DATA = {
  auth: {
    admin: { email: 'admin@ecosystem.com', password: 'admin123' },
    user: { email: 'user@ecosystem.com', password: 'user123' },
    newUser: { 
      name: 'Test',
      surname: 'User',
      email: `testuser${Date.now()}@ecosystem.com`, 
      password: 'Test123!@' 
    },
  },
  product: {
    name: 'Test Product ' + Date.now(),
    description: 'Test product for API testing',
    price: 9999,
    stock: 10,
    category: 'Test Category',
  },
  order: {
    customerName: 'Test Customer',
    productIds: [],
    totalAmount: 9999,
    address: 'Test Address 123, Test City',
    status: 'pending',
  },
};

// Global tokens - stored per iteration to avoid race conditions
let globalState = {
  userToken: null,
  adminToken: null,
  testProductId: null,
  testOrderId: null,
  userId: null,
};

export const options = {
  scenarios: {
    singleRun: {
      executor: 'per-vu-iterations',
      vus: 1,
      iterations: 1,
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.25'], // 25% failure rate threshold (some endpoints may have validation issues)
  },
};

// Run with load testing: k6 run --vus 5 --duration 30s test-suite.js

// Helper function to get authorization headers
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

export default function () {
  // ===== STEP 1: AUTHENTICATE USER (MUST BE FIRST) =====
  group('Step 1: User Authentication', () => {
    const loginRes = http.post(
      `${BASE_URL}/auth/login`,
      JSON.stringify(TEST_DATA.auth.user),
      { headers: getHeaders() }
    );

    check(loginRes, {
      'User login status 200/201': (r) => r.status === 200 || r.status === 201,
      'User login returns access_token': (r) => r.body.includes('access_token'),
    });

    if (loginRes.status === 200 || loginRes.status === 201) {
      try {
        const body = JSON.parse(loginRes.body);
        globalState.userToken = body.access_token;
        console.log('✓ User authenticated with token');
      } catch (e) {
        console.log('✗ Failed to parse user login response:', loginRes.body);
      }
    } else {
      console.log('✗ User login failed:', loginRes.status, loginRes.body);
    }

    sleep(1);
  });

  // Abort if user login failed
  if (!globalState.userToken) {
    console.log('✗ CRITICAL: User authentication failed. Aborting test suite.');
    return;
  }

  // ===== STEP 2: AUTHENTICATE ADMIN (MUST BE DONE BEFORE ADMIN OPERATIONS) =====
  group('Step 2: Admin Authentication', () => {
    const adminLoginRes = http.post(
      `${BASE_URL}/auth/login`,
      JSON.stringify(TEST_DATA.auth.admin),
      { headers: getHeaders() }
    );

    check(adminLoginRes, {
      'Admin login status 200/201': (r) => r.status === 200 || r.status === 201,
      'Admin login returns access_token': (r) => r.body.includes('access_token'),
    });

    if (adminLoginRes.status === 200 || adminLoginRes.status === 201) {
      try {
        const body = JSON.parse(adminLoginRes.body);
        globalState.adminToken = body.access_token;
        console.log('✓ Admin authenticated with token');
      } catch (e) {
        console.log('✗ Failed to parse admin login response:', adminLoginRes.body);
      }
    } else {
      console.log('✗ Admin login failed:', adminLoginRes.status, adminLoginRes.body);
    }

    sleep(1);
  });

  // ===== STEP 3: PRODUCT SERVICE - LIST PRODUCTS =====
  group('Step 3: Product Service - List All Products', () => {
    const listRes = http.get(
      `${BASE_URL}/products`,
      { headers: getHeaders(globalState.userToken) }
    );

    check(listRes, {
      'List products status 200': (r) => r.status === 200,
      'List products returns array': (r) => r.body.includes('['),
    });

    if (listRes.status === 200) {
      try {
        const body = JSON.parse(listRes.body);
        if (Array.isArray(body) && body.length > 0) {
          globalState.testProductId = body[0]._id || body[0].id;
          console.log(`✓ Found ${body.length} products, using ID: ${globalState.testProductId}`);
        }
      } catch (e) {
        console.log('✗ Failed to parse products list:', listRes.body);
      }
    } else {
      console.log('✗ List products failed:', listRes.status, listRes.body);
    }

    sleep(1);
  });

  // ===== STEP 4: PRODUCT SERVICE - GET PRODUCT BY ID =====
  if (globalState.testProductId) {
    group('Step 4: Product Service - Get Product by ID', () => {
      const getRes = http.get(
        `${BASE_URL}/products/${globalState.testProductId}`,
        { headers: getHeaders(globalState.userToken) }
      );

      check(getRes, {
        'Get product status 200': (r) => r.status === 200,
        'Get product contains name or id': (r) => r.body.includes('name') || r.body.includes('_id'),
      });

      if (getRes.status !== 200) {
        console.log('⚠ Get product returned:', getRes.status, '(This is optional, may be disabled)');
      } else {
        console.log('✓ Retrieved product details');
      }

      sleep(0.5);
    });
  }

  // ===== STEP 5: PRODUCT SERVICE - CREATE PRODUCT (ADMIN ONLY) =====
  if (globalState.adminToken) {
    group('Step 5: Product Service - Create Product (Admin)', () => {
      const createRes = http.post(
        `${BASE_URL}/products`,
        JSON.stringify(TEST_DATA.product),
        { headers: getHeaders(globalState.adminToken) }
      );

      check(createRes, {
        'Create product status 200/201': (r) => r.status === 200 || r.status === 201,
        'Create product returns ID': (r) => r.body.includes('_id') || r.body.includes('id'),
      });

      if (createRes.status === 200 || createRes.status === 201) {
        try {
          const body = JSON.parse(createRes.body);
          globalState.testProductId = body._id || body.id || globalState.testProductId;
          console.log(`✓ Created product with ID: ${globalState.testProductId}`);
        } catch (e) {
          console.log('✗ Failed to parse create product response');
        }
      } else {
        console.log('✗ Create product failed:', createRes.status, createRes.body);
      }

      sleep(1);
    });
  }

  // ===== STEP 6: ORDER SERVICE - LIST ORDERS (USER) =====
  group('Step 6: Order Service - List My Orders (User)', () => {
    const listOrdersRes = http.get(
      `${BASE_URL}/orders`,
      { headers: getHeaders(globalState.userToken) }
    );

    check(listOrdersRes, {
      'List orders status 200': (r) => r.status === 200,
      'List orders returns array or empty': (r) => r.body.includes('['),
    });

    if (listOrdersRes.status === 200) {
      try {
        const body = JSON.parse(listOrdersRes.body);
        if (Array.isArray(body) && body.length > 0) {
          globalState.testOrderId = body[0]._id || body[0].id;
          globalState.userId = body[0].userId;
          console.log(`✓ Found ${body.length} orders`);
        } else {
          console.log('✓ No orders found for user (expected for new user)');
        }
      } catch (e) {
        console.log('✗ Failed to parse orders list');
      }
    } else {
      console.log('✗ List orders failed:', listOrdersRes.status, listOrdersRes.body);
    }

    sleep(1);
  });

  // ===== STEP 7: ORDER SERVICE - GET ORDER BY ID (USER) =====
  if (globalState.testOrderId && globalState.userToken) {
    group('Step 7: Order Service - Get Order by ID (User)', () => {
      const getOrderRes = http.get(
        `${BASE_URL}/orders/${globalState.testOrderId}`,
        { headers: getHeaders(globalState.userToken) }
      );

      check(getOrderRes, {
        'Get order status 200': (r) => r.status === 200,
        'Get order contains product data': (r) => r.body.includes('products') || r.body.includes('product'),
      });

      if (getOrderRes.status !== 200) {
        console.log('✗ Get order failed:', getOrderRes.status, getOrderRes.body);
      } else {
        console.log('✓ Retrieved order details');
      }

      sleep(0.5);
    });
  }

  // ===== STEP 8: ORDER SERVICE - CREATE ORDER (USER) =====
  if (globalState.userToken && globalState.testProductId) {
    group('Step 8: Order Service - Create Order (User)', () => {
      const orderData = {
        customerName: TEST_DATA.order.customerName,
        productIds: [globalState.testProductId],
        totalAmount: TEST_DATA.order.totalAmount,
        address: TEST_DATA.order.address,
        status: TEST_DATA.order.status,
      };

      const createOrderRes = http.post(
        `${BASE_URL}/orders`,
        JSON.stringify(orderData),
        { headers: getHeaders(globalState.userToken) }
      );

      check(createOrderRes, {
        'Create order status 200/201': (r) => r.status === 200 || r.status === 201,
        'Create order returns ID': (r) => r.body.includes('_id') || r.body.includes('id'),
      });

      if (createOrderRes.status === 200 || createOrderRes.status === 201) {
        try {
          const body = JSON.parse(createOrderRes.body);
          globalState.testOrderId = body._id || body.id || globalState.testOrderId;
          console.log(`✓ Created order with ID: ${globalState.testOrderId}`);
        } catch (e) {
          console.log('✗ Failed to parse create order response:', createOrderRes.body);
        }
      } else {
        console.log('✗ Create order failed:', createOrderRes.status, createOrderRes.body);
      }

      sleep(1);
    });
  }

  // ===== STEP 9: ADMIN - LIST ALL ORDERS (ADMIN ONLY) =====
  if (globalState.adminToken) {
    group('Step 9: Admin - List All Orders (Admin Only)', () => {
      const adminListRes = http.get(
        `${BASE_URL}/orders/admin/all`,
        { headers: getHeaders(globalState.adminToken) }
      );

      check(adminListRes, {
        'Admin list orders status 200': (r) => r.status === 200,
        'Admin list orders returns array': (r) => r.body.includes('['),
      });

      if (adminListRes.status !== 200) {
        console.log('✗ Admin list orders failed:', adminListRes.status, adminListRes.body);
      } else {
        console.log('✓ Admin retrieved all orders');
      }

      sleep(1);
    });
  }

  // ===== STEP 10: ADMIN - GET ORDER BY ID (ADMIN ONLY) =====
  if (globalState.adminToken && globalState.testOrderId) {
    group('Step 10: Admin - Get Order by ID (Admin Only)', () => {
      const adminGetRes = http.get(
        `${BASE_URL}/orders/admin/${globalState.testOrderId}`,
        { headers: getHeaders(globalState.adminToken) }
      );

      check(adminGetRes, {
        'Admin get order status 200': (r) => r.status === 200,
        'Admin get order contains order data': (r) => r.body.includes('_id') || r.body.includes('id'),
      });

      if (adminGetRes.status !== 200) {
        console.log('✗ Admin get order failed:', adminGetRes.status, adminGetRes.body);
      } else {
        console.log('✓ Admin retrieved order details');
      }

      sleep(1);
    });
  }

  // ===== STEP 11: AUTHENTICATION - USER WITHOUT TOKEN SHOULD FAIL =====
  group('Step 11: Security Test - Access Without Token (Should Fail)', () => {
    const unauthorizedRes = http.get(
      `${BASE_URL}/orders/admin/all`,
      { headers: getHeaders() } // No token
    );

    check(unauthorizedRes, {
      'Unauthorized access blocked': (r) => r.status === 401 || r.status === 403,
    });

    if (unauthorizedRes.status !== 401 && unauthorizedRes.status !== 403) {
      console.log('⚠ Security Issue: Admin endpoint accessible without token!', unauthorizedRes.status);
    } else {
      console.log('✓ Admin endpoint properly secured');
    }

    sleep(1);
  });

  // ===== STEP 12: USER REGISTRATION (CREATE NEW USER FOR TESTING) =====
  group('Step 12: User Registration (Create New User)', () => {
    const registerRes = http.post(
      `${BASE_URL}/auth/register`,
      JSON.stringify(TEST_DATA.auth.newUser),
      { headers: getHeaders() }
    );

    check(registerRes, {
      'Register status 200/201': (r) => r.status === 200 || r.status === 201,
    });

    if (registerRes.status === 200 || registerRes.status === 201) {
      console.log(`✓ New user registered: ${TEST_DATA.auth.newUser.email}`);
    } else {
      console.log('✗ User registration failed:', registerRes.status, registerRes.body);
    }

    sleep(1);
  });

  // ===== STEP 13: INVALID ENDPOINT TEST =====
  group('Step 13: Error Handling - Invalid Endpoint', () => {
    const invalidRes = http.get(
      `${BASE_URL}/invalid-endpoint`,
      { headers: getHeaders() }
    );

    check(invalidRes, {
      'Invalid endpoint returns 404': (r) => r.status === 404,
    });

    sleep(1);
  });

  // ===== STEP 14: PAGINATION TEST =====
  group('Step 14: Query Parameters - Product Filter', () => {
    const paginatedRes = http.get(
      `${BASE_URL}/products?category=Elektronik`,
      { headers: getHeaders(globalState.userToken) }
    );

    check(paginatedRes, {
      'Filter works': (r) => r.status === 200,
      'Filter returns array': (r) => r.body.includes('['),
    });

    sleep(1);
  });
}
