// 온종일 본사 Service Worker
// 배포마다 CACHE 버전(끝 숫자)을 올리면 새 SW가 설치되고,
// 사용자가 하단 "업데이트"를 누르면 skipWaiting → 새 버전으로 새로고침됩니다.
const CACHE = "onjongil-honsa-20260731b";

self.addEventListener("install", () => {
  // 자동 활성화하지 않고 waiting 상태 유지 → 사용자가 "업데이트" 누를 때 활성화
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("message", (e) => {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});

// fetch 핸들러 없음 → 항상 네트워크(CDN)에서 최신을 받습니다.
