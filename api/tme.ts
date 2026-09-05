export const dynamic = 'force-dynamic';

export default async function handler(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const channel = searchParams.get('channel');
    const id = searchParams.get('id');
    const embed = searchParams.get('embed') || '1';

    if (!channel || !id) {
      return new Response(JSON.stringify({ error: 'Missing channel or id query parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ساخت آدرس مقصد در تلگرام
    const targetUrl = `https://t.me/${channel}/${id}?embed=${embed}`;

    // درخواست به تلگرام با User-Agent مرورگر
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9,fa;q=0.8',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return new Response(`Telegram HTTP Error: ${response.status}`, {
        status: response.status,
      });
    }

    const htmlContent = await response.text();

    return new Response(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    return new Response(`Proxy Error: ${error.message}`, {
      status: 500,
    });
  }
}
