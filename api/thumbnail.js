export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL이 필요합니다.' });

  let targetUrl = url;
  if (!/^https?:\/\//i.test(targetUrl)) targetUrl = 'https://' + targetUrl;

  const debug = [];

  // ── 시도 1: thum.io (무료, 즉시 반환) ──
  try {
    const thumioUrl = `https://image.thum.io/get/width/1200/crop/800/noanimate/${targetUrl}`;
    // 이미지가 실제로 응답하는지 확인
    const testRes = await fetch(thumioUrl, { method: 'HEAD' });
    debug.push({ service: 'thum.io', status: testRes.status, ok: testRes.ok });
    if (testRes.ok) {
      return res.status(200).json({ type: 'screenshot', imgUrl: thumioUrl });
    }
  } catch(e) {
    debug.push({ service: 'thum.io', error: e.message });
  }

  // ── 시도 2: microlink ──
  try {
    const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(targetUrl)}&screenshot=true&meta=false&embed=screenshot.url`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    debug.push({ service: 'microlink', status: data.status, data: data.data });
    const imgUrl = data?.data?.screenshot?.url;
    if (imgUrl) return res.status(200).json({ type: 'screenshot', imgUrl });
  } catch(e) {
    debug.push({ service: 'microlink', error: e.message });
  }

  return res.status(404).json({ error: '썸네일을 가져올 수 없습니다.', debug });
}
