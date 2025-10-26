// functions/api/gog.js
export async function onRequestGet(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    
    // 获取查询参数
    const page = url.searchParams.get('page') || '1';
    const sort = url.searchParams.get('sort') || 'popularity';
    
    // 构建 GOG API URL
    const gogUrl = new URL('https://www.gog.com/games/ajax/filtered');
    gogUrl.searchParams.set('mediaType', 'game');
    gogUrl.searchParams.set('price', 'free');
    gogUrl.searchParams.set('sort', sort);
    gogUrl.searchParams.set('page', page);
    
    console.log('Fetching GOG games from:', gogUrl.toString());
    
    const response = await fetch(gogUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'en-US,en;q=0.9',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': 'https://www.gog.com/'
      }
    });
    
    if (!response.ok) {
      throw new Error(`GOG API responded with ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': 'max-age=1800', // 缓存30分钟
      },
    });
  } catch (error) {
    console.error('Error fetching GOG games:', error);
    
    // 返回空结果而不是错误，这样不会影响其他平台的数据
    return new Response(JSON.stringify({ 
      products: [],
      error: 'GOG API temporarily unavailable',
      message: error.message 
    }), {
      status: 200, // 返回200而不是500，避免影响其他API
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
