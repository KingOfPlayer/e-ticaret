import http from 'k6/http';
import { check, group, sleep } from 'k6';

// Test data configuration
const TEST_DATA = {
  auth: {
    user: { email: 'user@ecosystem.com', password: 'user123' },
  },
};

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

// 1. YAPILANDIRMA: Dökümandaki 50, 100, 200, 500 kullanıcı hedefleri 
export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Rampa: 50 kullanıcı
    { duration: '1m', target: 50 },   // Stabil: 50 kullanıcı
    { duration: '30s', target: 200 }, // Rampa: 200 kullanıcı
    { duration: '1m', target: 200 },  // Stabil: 200 kullanıcı
    { duration: '30s', target: 500 }, // Ekstrem Yük: 500 kullanıcı 
    { duration: '1m', target: 500 },  // Dayanıklılık testi
    { duration: '30s', target: 0 },   // Cooldown
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // Yanıt süreleri döküman için kritik 
    http_req_failed: ['rate<0.05'],   // Hata oranları takibi 
  },
};

const BASE_URL = 'http://localhost:5000/api';

export default function () {
  // Her sanal kullanıcı (VU) için rastgele bir davranış seçerek "dallanma" sağlıyoruz
  const userType = Math.random();

  // --- DALLANMA 1: ÜRÜN GEZGİNİ (Sadece okuma yapar, yoğun trafik simülasyonu) ---
  if (userType < 0.6) { // Kullanıcıların %60'ı sadece ürünlere baksın
    group('Scenario: Product Discovery', function () {
      const res = http.get(`${BASE_URL}/products`);
      check(res, { 'Product list status 200': (r) => r.status === 200 });
      sleep(Math.random() * 2 + 1);
    });
  }

  // --- DALLANMA 2: SİPARİŞ VEREN KULLANICI (Auth + Yazma işlemi) ---
  else if (userType < 0.9) { // Kullanıcıların %30'u işlem yapsın
    group('Scenario: Order Workflow & Detail Check', function () {
      // 1. Login (Dispatcher üzerinden Auth Service'e gider) [cite: 39, 48]
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

          // --- YENİ DALLANMA: Eğer sipariş varsa, rastgele birinin detayına git ---
          if (Array.isArray(orders) && orders.length > 0) {
            // Kullanıcıların %50'si en son siparişinin detayına baksın
            if (Math.random() > 0.5) {
              const orderId = orders[0]._id || orders[0].id; // NoSQL ID yapısına göre [cite: 64]

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

  // --- DALLANMA 3: GÜVENLİK TESTİ (Yetkisiz erişim denemesi) ---
  else { // Kullanıcıların %10'u hata/güvenlik senaryosu oluştursun
    group('Scenario: Security Check', function () {
      // Dispatcher'ın yetkisiz istekleri reddetme başarısı ölçülür [cite: 41, 48]
      const unauthorizedRes = http.get(`${BASE_URL}/orders/admin/all`);
      check(unauthorizedRes, {
        'Unauthorized access blocked (401/403)': (r) => r.status === 401 || r.status === 403,
      });
      sleep(3);
    });
  }
}