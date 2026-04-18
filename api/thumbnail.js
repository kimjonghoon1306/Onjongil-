/* ============================================================
   api/thumbnail.js — Vercel Serverless Function
   URL을 받아서 OG 이미지 또는 스크린샷 URL을 반환
   ============================================================ */

export default async function handler(req, res) {
  // CORS 허용
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL이 필요합니다.' });

  let targetUrl = url;
  if (!/^https?:\/\//i.test(targetUrl)) targetUrl = 'https://' + targetUrl;

  // ── 1단계: HTML 파싱 → og:image / twitter:image 추출 ──
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OnJongIlBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
      },
    });
    clearTimeout(timer);

    if (response.ok) {
      const html = await response.text();
      const ogImg = parseOgImage(html, targetUrl);
      if (ogImg) {
        return res.status(200).json({ type: 'og', imgUrl: ogImg });
      }
    }
  } catch (e) {
    // 타임아웃 또는 fetch 실패 → 다음 단계로
  }

  // ── 2단계: microlink 스크린샷 (서버에서 호출) ──
  try {
    const ssUrl = `https://api.microlink.io/?url=${encodeURIComponent(targetUrl)}&screenshot=true&meta=false&embed=screenshot.url`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    const mlRes = await fetch(ssUrl, { signal: controller.signal });
    clearTimeout(timer);

    if (mlRes.ok) {
      const data = await mlRes.json();
      const imgUrl = data?.data?.screenshot?.url;
      if (imgUrl) {
        return res.status(200).json({ type: 'screenshot', imgUrl });
      }
    }
  } catch (e) {
    // microlink 실패 → 다음 단계로
  }

  // ── 3단계: screenshotone 무료 플랜 ──
  try {
    const ssUrl = `https://api.screenshotone.com/take?url=${encodeURIComponent(targetUrl)}&full_page=false&viewport_width=1280&viewport_height=720&format=jpg&image_quality=80&access_key=free`;
    return res.status(200).json({ type: 'screenshot', imgUrl: ssUrl });
  } catch (e) {}

  return res.status(404).json({ error: '썸네일을 가져올 수 없습니다.' });
}

function parseOgImage(html, baseUrl) {
  const patterns = [
    /property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
    /name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i,
    /property=["']og:image:secure_url["'][^>]*content=["']([^"']+)["']/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m && m[1]) {
      let img = m[1].trim();
      // 상대경로 처리
      if (img.startsWith('//')) img = 'https:' + img;
      else if (img.startsWith('/')) {
        try { img = new URL(img, baseUrl).href; } catch(e) {}
      }
      if (img.startsWith('http')) return img;
    }
  }
  return null;
}

