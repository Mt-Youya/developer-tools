import { useState, useMemo } from "react";
import { useFreeGames } from "@/hooks/useFreeGames";
import { Button } from "@devtools/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@devtools/ui/Card";
import { ExternalLink, Gamepad2, RefreshCw, Heart, Star } from "lucide-react";
import { sortBy } from "lodash-es";
import GameCard from "./components/GameCard";

interface favoriteGame{
  id: string;
  title: string;
  platform: string;
}
function useUserPreferences() {
  const [preferences, setPreferences] = useState({
    favoriteGames: [],
    hiddenGames: [],
  });

  function toggleFavoriteGame(gameId: string) {
    setPreferences((prev) => {
      const isAlreadyFavorite = prev.favoriteGames.includes(gameId);
      return {
        ...prev,
        favoriteGames: isAlreadyFavorite
          ? prev.favoriteGames.filter((id) => id !== gameId)
          : [...prev.favoriteGames, gameId],
      };
    });
  }

  function hideGame(gameId) {
    setPreferences((prev) => ({
      ...prev,
      hiddenGames: [...prev.hiddenGames, gameId],
    }));
  }

  return {
    preferences,
    toggleFavoriteGame,
    hideGame,
  };
}

// 游戏卡片组件

// 静态链接数据
const staticPlatforms = [
  {
    name: "Epic Games Store",
    list: [
      {
        title: "每周免费游戏",
        url: "https://store.epicgames.com/zh-CN/free-games",
      },
      {
        title: "Epic Games 促销",
        url: "https://store.epicgames.com/zh-CN/sales-and-specials",
      },
    ],
  },
  {
    name: "Steam",
    list: [
      {
        title: "Steam 免费游戏",
        url: "https://store.steampowered.com/genre/Free%20to%20Play/",
      },
      { title: "Steam 限时免费", url: "https://steamdb.info/upcoming/free/" },
    ],
  },
  {
    name: "其他平台",
    list: [
      {
        title: "GOG 免费游戏",
        url: "https://www.gog.com/games?priceRange=0,0&sort=popularity&page=1",
      },
      { title: "Itch.io 免费游戏", url: "https://itch.io/games/free" },
    ],
  },
];

function FreeGames() {
  const { data, loading, error, lastUpdated, refetch } = useFreeGames();
  const { preferences, toggleFavoriteGame, hideGame } = useUserPreferences();
  const [activeTab, setActiveTab] = useState("games");

  const allGames = useMemo(() => {
    const games = sortBy(
      Object.keys(data)
        .map((key) => data[key])
        .flat(),
      (item) => new Date(item.endDate)
    );
    return games.filter((game) => !preferences.hiddenGames.includes(game.id));
  }, [data, preferences.hiddenGames]);

  const favoriteGames = useMemo(() => {
    return allGames.filter((game) =>
      preferences.favoriteGames.includes(game.id)
    );
  }, [allGames, preferences.favoriteGames]);

  const [platform, setPlatform] = useState("all");

  const filteredGames = useMemo(() => {
    if (platform === "all") return allGames;
    return allGames.filter((game) => game.platform === platform);
  }, [allGames, platform]);

  const filteredPlatforms = useMemo(
    () =>
      ["all", ...new Set(allGames.map((game) => game.platform))].filter(
        Boolean
      ),
    [allGames]
  );

  const [expanded, setExpanded] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Gamepad2 className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              免费游戏聚合平台
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            实时获取 Epic Games、Steam
            等平台的免费游戏信息，从此不再错过任何好游戏！
          </p>

          <div className="flex justify-center gap-4 mb-4">
            <Button
              variant={activeTab === "games" ? "default" : "outline"}
              onClick={() => setActiveTab("games")}
            >
              所有游戏 ({allGames.length})
            </Button>
            <Button
              variant={activeTab === "favorites" ? "default" : "outline"}
              onClick={() => setActiveTab("favorites")}
            >
              <Heart className="h-4 w-4 mr-2" />
              收藏 ({favoriteGames.length})
            </Button>
            <Button
              variant={activeTab === "links" ? "default" : "outline"}
              onClick={() => setActiveTab("links")}
            >
              平台链接
            </Button>
            <Button variant="outline" onClick={refetch} disabled={loading}>
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              刷新数据
            </Button>
          </div>

          {loading && (
            <div className="text-sm text-muted-foreground mb-4">
              🎮 正在获取最新的免费游戏信息...
            </div>
          )}

          {error && <div className="text-sm text-red-500 mb-4">❌ {error}</div>}

          {lastUpdated && (
            <div className="text-xs text-muted-foreground">
              最后更新：{lastUpdated.toLocaleString("zh-CN")}
            </div>
          )}
        </div>

        {activeTab === "games" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              className={`col-span-full flex flex-wrap gap-2 mb-4 relative ${
                !expanded ? "" : "max-h-10 overflow-hidden"
              }`}
            >
              {filteredPlatforms.map(
                (plat) =>
                  plat && (
                    <Button
                      key={plat}
                      variant={platform === plat ? "default" : "outline"}
                      className="cursor-pointer p-2"
                      onClick={() => setPlatform(plat)}
                    >
                      {plat === "all" ? "全部平台" : plat}
                    </Button>
                  )
              )}
              <Button
                variant="outline"
                className="cursor-pointer p-2 absolute top-0 right-0 bg-gradient-to-t from-white dark:from-slate-800"
                onClick={() => setExpanded(!expanded)}
              >
                {!expanded ? "收起" : "展开"}
              </Button>
            </div>

            {filteredGames.length > 0 ? (
              filteredGames.map((game, idx) => (
                <GameCard
                  key={idx + Math.random()}
                  game={game}
                  isFavorite={preferences.favoriteGames.includes(game.id)}
                  onToggleFavorite={toggleFavoriteGame}
                  onHide={hideGame}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Gamepad2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">
                  {loading ? "加载中..." : "暂无游戏数据"}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteGames.length > 0 ? (
              favoriteGames.map((game, idx) => (
                <GameCard
                  key={idx + Math.random()}
                  game={game}
                  isFavorite={true}
                  onToggleFavorite={toggleFavoriteGame}
                  onHide={hideGame}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">
                  还没有收藏的游戏
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  在游戏卡片上点击心形图标来收藏游戏
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "links" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staticPlatforms.map(({ name, list }, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    {name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {list?.map(({ title, url }, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {title}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {new URL(url).hostname}
                        </p>
                      </div>
                      <Button asChild variant="ghost" size="sm">
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <Card className="inline-block p-6 bg-primary/5 border-primary/20">
            <p className="text-sm text-muted-foreground">
              💡 <strong>小贴士：</strong>
              建议将此页面添加到收藏夹，定期查看最新的免费游戏信息！
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default FreeGames;
