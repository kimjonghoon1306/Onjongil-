export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL이 필요합니다.' });

  let targetUrl = url;
  if (!/^https?:\/\//i.test(targetUrl)) targetUrl = 'https://' + targetUrl;

  try {
    const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(targetUrl)}&screenshot=true&meta=false&embed=screenshot.url&ttl=7d`;
    const response = await fetch(apiUrl, { headers: { 'x-api-key': '' } });
    const data = await response.json();
    const imgUrl = data?.data?.screenshot?.url;
    if (imgUrl) return res.status(200).json({ type: 'screenshot', imgUrl });
  } catch(e) {}

  return res.status(404).json({ error: '썸네일을 가져올 수 없습니다.' });
}
