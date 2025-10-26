// functions/api/free-games.js
// 多平台免费游戏聚合API

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const platform = url.searchParams.get('platform') || 'all';

  try {
    let results = {};

    // Epic Games (已有的代码)
    if (platform === 'all' || platform === 'epic') {
      results.epic = await getEpicGames();
    }

    // Steam 免费游戏
    if (platform === 'all' || platform === 'steam') {
      results.steam = await getSteamFreeGames();
    }

    // GOG 免费游戏
    if (platform === 'all' || platform === 'gog') {
      results.gog = await getGOGFreeGames();
    }

    // 使用第三方聚合服务
    if (platform === 'all' || platform === 'aggregated') {
      results.aggregated = await getAggregatedFreeGames();
    }

    return new Response(JSON.stringify(results), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'max-age=3600' // 缓存1小时
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Epic Games 免费游戏
async function getEpicGames() {
  try {
    const response = await fetch('https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=zh-CN&country=CN&allowCountries=CN');
    const data = await response.json();
    const games = data?.data?.Catalog?.searchStore?.elements ?? [];

    return games
      .filter(game => {
        const price = game?.price?.totalPrice?.discountPrice ?? game?.price?.totalPrice?.originalPrice;
        return price === 0 && game?.promotions?.promotionalOffers?.length > 0;
      })
      .map(game => ({
        id: game.id || game.gameId || game.gameid || game.gameID|| game.game_id,
        title: game.title,
        description: game.description,
        url: `https://www.epicgames.com/store/zh-CN/p/${game?.catalogNs?.mappings?.[0]?.pageSlug}`,
        platform: 'Epic Games',
        image: game?.keyImages?.find(img => img.type === 'OfferImageWide')?.url || '',
        endDate: game?.promotions?.promotionalOffers?.[0]?.promotionalOffers?.[0]?.endDate
      }));
  } catch (error) {
    console.error('Epic Games API Error:', error);
    return [];
  }
}

// Steam 免费游戏（使用第三方服务）
async function getSteamFreeGames() {
  try {
    // 使用 Steam Store API 搜索免费游戏
    const response = await fetch('https://store.steampowered.com/api/featuredcategories', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) throw new Error('Steam API failed');

    const data = await response.json();
    // 处理 Steam 数据结构
    return data?.specials?.items?.slice(0, 10)?.map(game => ({
      id: game.id || game.gameId || game.gameid || game.gameID|| game.game_id,
      title: game.name,
      description: game.header_image ? 'Steam 特惠游戏' : '',
      url: `https://store.steampowered.com/app/${game.id}/`,
      platform: 'Steam',
      image: game.header_image || '',
      originalPrice: game.original_price,
      finalPrice: game.final_price,
      discountPercent: game.discount_percent
    })) || [];
  } catch (error) {
    console.error('Steam API Error:', error);
    return [];
  }
}

// GOG 免费游戏
async function getGOGFreeGames() {
  try {
    // GOG API（非官方，可能不稳定）
    const response = await fetch('https://www.gog.com/games/ajax/filtered?mediaType=game&price=free&sort=popularity&page=1', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (!response.ok) throw new Error('GOG API failed');

    const data = await response.json();
    return data?.products?.slice(0, 10)?.map(game => ({
      id: game.id || game.gameId || game.gameid || game.gameID|| game.game_id,
      title: game.title,
      description: game.genre || 'GOG 免费游戏',
      url: `https://www.gog.com${game.url}`,
      platform: 'GOG',
      image: `https:${game.image}_product_card_v2_mobile_slider_639.jpg`,
      price: game.price
    })) || [];
  } catch (error) {
    console.error('GOG API Error:', error);
    return [];
  }
}

// 使用第三方聚合服务
async function getAggregatedFreeGames() {
  try {
    // 使用 FreeToGame API
    const response = await fetch('https://www.freetogame.com/api/games?platform=pc&sort-by=popularity');
    const data = await response.json();

    return data?.map(game => ({
      id: game.id || game.gameId || game.gameid || game.gameID|| game.game_id,
      title: game.title,
      description: game.short_description,
      url: game.game_url,
      platform: game.publisher,
      image: game.thumbnail,
      genre: game.genre,
      releaseDate: game.release_date
    })) || [];
  } catch (error) {
    console.error('Aggregated API Error:', error);
    return [];
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}