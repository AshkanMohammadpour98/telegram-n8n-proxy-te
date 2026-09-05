/**
 * Telegram Embed Proxy - For n8n workflows
 * Bypasses Iran filtering by proxying t.me embed pages through Vercel
 *
 * Usage:
 *   GET /api/tme?channel=CHANNEL&id=MESSAGE_ID&embed=1
 */
export default async function handler(req, res) {
  try {
    // Extract query parameters
    const { channel، id = '1', embed = '1' } = req.query;

    // Validate channel parameter
    if (!channel) {
      return res.status(400).json({ error: 'channel parameter is required' });
    }

    // Build the target Telegram URL
    const targetUrl = `https://t.me/${channel}/${id}?embed=${embed}`;

    // Fetch the embed page
    const response = await fetch(targetUrl, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    // Read the HTML content
    const html = await response.text();

    // Return HTML with CORS headers so n8n can read it
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store');

    return res.status(response.status).send(html);

  } catch (error) {
    return res.status(500).json({
      error: 'Proxy error',
      message: error.message,
    });
  }
}
