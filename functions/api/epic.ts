export async function onRequestGet(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);

    // 获取查询参数
    const locale = url.searchParams.get('locale') || 'en-US';
    const country = url.searchParams.get('country') || 'US';
    const allowCountries = url.searchParams.get('allowCountries') || 'US';
    const api = url.searchParams.get('api') || 'https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions';

    // 构建请求URL，添加参数
    const epicUrl = new URL(api);
    epicUrl.searchParams.set('locale', locale);
    epicUrl.searchParams.set('country', country);
    epicUrl.searchParams.set('allowCountries', allowCountries);

    const response = await fetch(epicUrl.toString());
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': 'max-age=300',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to fetch data',
      message: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}