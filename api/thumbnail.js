export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL이 필요합니다.' });

  let targetUrl = url;
  if (!/^https?:\/\//i.test(targetUrl)) targetUrl = 'https://' + targetUrl;

  // WordPress mshots - 즉시 반환, 무료, 무제한
  const cleanUrl = targetUrl.replace(/^https?:\/\//, '');
  const imgUrl = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(targetUrl)}?w=1200&h=800`;

  return res.status(200).json({ type: 'screenshot', imgUrl });
}
