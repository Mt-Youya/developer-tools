// functions/api/steam.js
export async function onRequestGet(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    
    // 获取查询参数
    const category = url.searchParams.get('category') || 'free';
    const count = url.searchParams.get('count') || '50';
    
    let steamData = [];
    
    if (category === 'free') {
      // 方案1: 获取免费游戏列表
      steamData = await fetchSteamFreeGames();
    } else if (category === 'specials') {
      // 方案2: 获取特价游戏（价格为0的）
      steamData = await fetchSteamSpecials();
    }
    
    return new Response(JSON.stringify({
      games: steamData,
      count: steamData.length,
      source: 'Steam Store'
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': 'max-age=1800', // 缓存30分钟
      },
    });
  } catch (error) {
    console.error('Error fetching Steam games:', error);
    
    // 返回空结果而不是错误
    return new Response(JSON.stringify({ 
      games: [],
      count: 0,
      error: 'Steam API temporarily unavailable',
      message: error.message 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// 获取 Steam 免费游戏
async function fetchSteamFreeGames() {
  try {
    // 方案1: 使用 Steam Web API (需要处理 CORS)
    const response = await fetch('https://store.steampowered.com/api/featuredcategories/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Steam API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 处理 Steam API 响应
    let games = [];
    
    // 从不同的分类中提取免费游戏
    if (data.specials && data.specials.items) {
      games = games.concat(data.specials.items.filter(item => 
        item.final_price === 0 || item.original_price === 0
      ));
    }
    
    if (data.coming_soon && data.coming_soon.items) {
      games = games.concat(data.coming_soon.items.filter(item => 
        item.final_price === 0 || item.original_price === 0
      ));
    }
    
    // 格式化游戏数据
    return games.slice(0, 20).map(game => ({
      id: `steam-${game.id}`,
      title: game.name,
      description: game.header_image ? 'Steam 免费游戏' : game.name,
      url: `https://store.steampowered.com/app/${game.id}/`,
      platform: 'Steam',
      image: game.header_image || game.small_image || '',
      originalPrice: (game.original_price || 0) / 100, // Steam 价格是分为单位
      discountPrice: (game.final_price || 0) / 100,
      discountPercent: game.discount_percent || 0,
      genre: 'Steam 免费游戏',
      developer: '未知'
    }));
    
  } catch (error) {
    console.error('Steam featuredcategories API failed:', error);
    
    // 备用方案: 返回一些知名的免费 Steam 游戏
    return getFallbackSteamGames();
  }
}

// 获取 Steam 特价游戏
async function fetchSteamSpecials() {
  try {
    // 使用 Steam 搜索 API 查找免费游戏
    const searchUrl = 'https://store.steampowered.com/search/results/' + 
      '?query=&start=0&count=50&dynamic_data=&sort_by=_ASC&tags=113&snr=1_7_7_popularnew_7&infinite=1';
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Steam search error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.results_html) {
      return parseSteamSearchResults(data.results_html);
    }
    
    return [];
  } catch (error) {
    console.error('Steam search API failed:', error);
    return [];
  }
}

// 解析 Steam 搜索结果 HTML
function parseSteamSearchResults(html) {
  try {
    // 简单的 HTML 解析（在实际环境中可能需要更复杂的处理）
    const games = [];
    
    // 使用正则表达式提取游戏信息（这是一个简化版本）
    const gameRegex = /<a href="https:\/\/store\.steampowered\.com\/app\/(\d+)\/[^"]*"[^>]*>.*?<span class="title">([^<]+)<\/span>/gs;
    let match;
    
    while ((match = gameRegex.exec(html)) !== null && games.length < 20) {
      const [, appId, title] = match;
      games.push({
        id: `steam-${appId}`,
        title: title.trim(),
        description: 'Steam 免费游戏',
        url: `https://store.steampowered.com/app/${appId}/`,
        platform: 'Steam',
        image: `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`,
        originalPrice: 0,
        discountPrice: 0,
        genre: 'Steam 免费游戏',
        developer: '未知'
      });
    }
    
    return games;
  } catch (error) {
    console.error('Failed to parse Steam HTML:', error);
    return [];
  }
}

// 备用的免费 Steam 游戏列表
function getFallbackSteamGames() {
  return [
    {
      id: 'steam-570',
      title: 'Dota 2',
      description: '多人在线战斗竞技场游戏',
      url: 'https://store.steampowered.com/app/570/Dota_2/',
      platform: 'Steam',
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg',
      originalPrice: 0,
      discountPrice: 0,
      genre: 'MOBA',
      developer: 'Valve'
    },
    {
      id: 'steam-730',
      title: 'Counter-Strike 2',
      description: '第一人称射击游戏',
      url: 'https://store.steampowered.com/app/730/CounterStrike_2/',
      platform: 'Steam',
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg',
      originalPrice: 0,
      discountPrice: 0,
      genre: 'FPS',
      developer: 'Valve'
    },
    {
      id: 'steam-440',
      title: 'Team Fortress 2',
      description: '团队射击游戏',
      url: 'https://store.steampowered.com/app/440/Team_Fortress_2/',
      platform: 'Steam',
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/440/header.jpg',
      originalPrice: 0,
      discountPrice: 0,
      genre: 'FPS',
      developer: 'Valve'
    },
    {
      id: 'steam-238960',
      title: 'Path of Exile',
      description: '动作角色扮演游戏',
      url: 'https://store.steampowered.com/app/238960/Path_of_Exile/',
      platform: 'Steam',
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/238960/header.jpg',
      originalPrice: 0,
      discountPrice: 0,
      genre: 'ARPG',
      developer: 'Grinding Gear Games'
    },
    {
      id: 'steam-1172470',
      title: 'Apex Legends',
      description: '大逃杀射击游戏',
      url: 'https://store.steampowered.com/app/1172470/Apex_Legends/',
      platform: 'Steam',
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg',
      originalPrice: 0,
      discountPrice: 0,
      genre: 'Battle Royale',
      developer: 'Respawn Entertainment'
    }
  ];
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
