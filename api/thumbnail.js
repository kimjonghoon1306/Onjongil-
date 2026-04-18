export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL이 필요합니다.' });

  let targetUrl = url;
  if (!/^https?:\/\//i.test(targetUrl)) targetUrl = 'https://' + targetUrl;

  // Vercel 스크린샷 API (Vercel에 올라간 사이트는 100% 작동)
  const screenshotUrl = `https://vercel.com/api/screenshot?url=${encodeURIComponent(targetUrl)}&teamId=&withStatus=1`;

  return res.status(200).json({ type: 'screenshot', imgUrl: screenshotUrl });
}
