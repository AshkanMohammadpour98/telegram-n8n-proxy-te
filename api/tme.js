export default async function handler(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const channel = url.searchParams.get('channel');
    const id = url.searchParams.get('id') || '1';
    const embed = url.searchParams.get('embed') || '1';

    if (!channel) {
      return new Response(JSON.stringify({ error: 'channel parameter is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const targetUrl = `https://t.me/${channel}/${id}?embed=${embed}`;
    
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
