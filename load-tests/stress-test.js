import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 50 },  // 50 kullanıcıya çık (Rampa)
    { duration: '20s', target: 50 },  // 50 kullanıcıda stabilize ol
    { duration: '10s', target: 200 }, // 200 kullanıcı yüküne çık (%400 artış)
    { duration: '20s', target: 200 }, // Yüksek yükte bekle
    { duration: '10s', target: 500 }, // Ekstrem Yük testi 500 VUS
    { duration: '10s', target: 500 }, // Çakılacak mı test et
    { duration: '20s', target: 0 },   // Yumuşak iniş ve cooldown
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // %95 istek 500ms altında olmalı
    http_req_failed: ['rate<0.05'],   // Tüm zamanlar hata oranı %5 altında kalmalı
  },
};

export default function () {
  // 1. Uç Nokta: Tüm ürünleri listeleme
  let res1 = http.get('http://localhost:5000/api/products');
  check(res1, {
    'List Products: status is 200': (r) => r.status === 200,
  });
  
  // Rastgele düşünme süresi (insansal davranış)
  sleep(Math.random() * 2);

  // 2. Uç Nokta: Belirli bir siparişi sorgulama denemesi
  let res2 = http.get('http://localhost:5000/api/orders');
  check(res2, {
    'List Orders: status check (200/401)': (r) => r.status === 200 || r.status === 401,
  });

  sleep(Math.random() * 1);
}
