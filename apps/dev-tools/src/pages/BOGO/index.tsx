import { cn } from "@devtools/libs"
import type { Game } from "@devtools/shared"
import { Button } from "@devtools/ui"
import { Card, CardContent, CardHeader, CardTitle } from "@devtools/ui/Card"
import { sortBy } from "lodash-es"
import { ArrowDown, ArrowUp, ExternalLink, Gamepad2, Heart, RefreshCw, Star } from "lucide-react"
import { Activity } from "react"
import { CurtainPreloader, StairsPreloader } from "@/components/PreLoader"
import { useFreeGames } from "@/hooks/useFreeGames"
import GameCard from "./components/GameCard"

interface UserPreferences {
  favoriteGames: string[]
  hiddenGames: string[]
}

interface StaticPlatform {
  name: string
  list: Array<{
    title: string
    url: string
  }>
}

type TabType = "games" | "favorites" | "links"

const STATIC_PLATFORMS: StaticPlatform[] = [
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
      {
        title: "Steam 限时免费",
        url: "https://steamdb.info/upcoming/free/",
      },
    ],
  },
  {
    name: "其他平台",
    list: [
      {
        title: "GOG 免费游戏",
        url: "https://www.gog.com/games?priceRange=0,0&sort=popularity&page=1",
      },
      {
        title: "Itch.io 免费游戏",
        url: "https://itch.io/games/free",
      },
    ],
  },
]

const DEFAULT_PREFERENCES: UserPreferences = {
  favoriteGames: [],
  hiddenGames: [],
}

function useUserPreferences() {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES)

  function toggleFavoriteGame(gameId: string) {
    setPreferences((prev) => ({
      ...prev,
      favoriteGames: prev.favoriteGames.includes(gameId)
        ? prev.favoriteGames.filter((id) => id !== gameId)
        : [...prev.favoriteGames, gameId],
    }))
  }

  function hideGame(gameId: string) {
    setPreferences((prev) => ({
      ...prev,
      hiddenGames: [...prev.hiddenGames, gameId],
    }))
  }
  function resetPreferences() {
    setPreferences(DEFAULT_PREFERENCES)
  }
  return {
    preferences,
    toggleFavoriteGame,
    hideGame,
    resetPreferences,
  }
}

export interface FavoritesProps {
  games: Game[]
  toggleFavoriteGame: GamesProps["toggleFavoriteGame"]
  hideGame: GamesProps["hideGame"]
}

function Favorites({ games, toggleFavoriteGame, hideGame }: FavoritesProps) {
  "use memo"
  if (games.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <p className="text-lg text-muted-foreground">还没有收藏的游戏</p>
        <p className="text-sm text-muted-foreground mt-2">在游戏卡片上点击心形图标来收藏游戏</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {games.map((game) => (
        <GameCard key={game.id} game={game} isFavorite={true} onToggleFavorite={toggleFavoriteGame} onHide={hideGame} />
      ))}
    </div>
  )
}

interface GamesProps {
  games: Game[]
  filteredPlatforms: string[]
  setPlatform: (platform: string) => void
  platform: string
  favoriteGames: string[]
  toggleFavoriteGame: (gameId: string) => void
  hideGame: (gameId: string) => void
  loading?: boolean
}

function Games({
  games,
  filteredPlatforms,
  setPlatform,
  platform,
  favoriteGames,
  toggleFavoriteGame,
  hideGame,
  loading,
}: GamesProps) {
  "use memo"
  const [expanded, setExpanded] = useState(false)

  if (games.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <Gamepad2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <p className="text-lg text-muted-foreground">{loading ? "加载中..." : "暂无游戏数据"}</p>
      </div>
    )
  }

  return (
    <>
      <div className="col-span-full p-4 pb-6 mb-4 rounded-lg overflow-hidden relative">
        <div className={cn("flex flex-wrap gap-2 relative", !expanded && "max-h-30 overflow-hidden")}>
          {filteredPlatforms.map((plat) => (
            <Button
              key={plat}
              variant={platform === plat ? "default" : "outline"}
              size="sm"
              onClick={() => setPlatform(plat)}
            >
              {plat === "all" ? "全部平台" : plat}
            </Button>
          ))}
        </div>
        {filteredPlatforms.length > 8 && (
          <div className={"w-full flex justify-center items-center relative z-4"}>
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => setExpanded(!expanded)}>
              {expanded ? "收起" : "展开更多平台"}
              {expanded ? <ArrowUp /> : <ArrowDown />}
            </Button>
          </div>
        )}
        {!expanded && (
          <div className="absolute inset-0 bg-linear-to-t from-white dark:from-slate-950 to-transparent pointer-events-none" />
        )}
      </div>

      <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            isFavorite={favoriteGames.includes(game.id)}
            onToggleFavorite={toggleFavoriteGame}
            onHide={hideGame}
          />
        ))}
      </div>
    </>
  )
}

function PlatformLinks() {
  "use memo"
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {STATIC_PLATFORMS.map((platform) => (
        <Card key={platform.name} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              {platform.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {platform.list.map((link) => (
              <div
                key={link.url}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{link.title}</h4>
                  <p className="text-xs text-muted-foreground truncate">{new URL(link.url).hostname}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function FreeGames() {
  "use memo"
  const { data, loading, error, lastUpdated, refetch } = useFreeGames()
  const { preferences, toggleFavoriteGame, hideGame } = useUserPreferences()
  const [activeTab, setActiveTab] = useState<TabType>("games")
  const [platform, setPlatform] = useState("all")
  const games = sortBy(Object.values(data).flat(), (item) => new Date(item.endDate).getTime())
  const allGames = games.filter((game) => !preferences.hiddenGames.includes(game.id))

  const favoriteGames = allGames.filter((game) => preferences.favoriteGames.includes(game.id))

  const filteredGames = platform === "all" ? allGames : allGames.filter((game) => game.platform === platform)

  const platforms = [...new Set(allGames.map((game) => game.platform).filter(Boolean))]
  const filteredPlatforms = ["all", ...platforms]

  return (
    <StairsPreloader loading={loading} loadingText="Loading your Buy one Get one...">
      <div className="flex-1 bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Gamepad2 className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold bg-linear-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                免费游戏聚合平台
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              实时获取 Epic Games、Steam 等平台的免费游戏信息,从此不再错过任何好游戏!
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <Button variant={activeTab === "games" ? "default" : "outline"} onClick={() => setActiveTab("games")}>
                所有游戏 ({allGames.length})
              </Button>
              <Button
                variant={activeTab === "favorites" ? "default" : "outline"}
                className="flex items-center justify-center"
                onClick={() => setActiveTab("favorites")}
              >
                <Heart className="h-4 w-4" />
                收藏 ({favoriteGames.length})
              </Button>
              <Button variant={activeTab === "links" ? "default" : "outline"} onClick={() => setActiveTab("links")}>
                平台链接
              </Button>
              <Button
                variant="outline"
                onClick={refetch}
                disabled={loading}
                className="flex items-center justify-center"
              >
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                刷新数据
              </Button>
            </div>

            {loading && <div className="text-sm text-muted-foreground mb-4">🎮 正在获取最新的免费游戏信息...</div>}

            {error && (
              <div className="text-sm text-red-500 mb-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                ❌ 获取数据失败:{error}
              </div>
            )}

            {lastUpdated && !loading && (
              <div className="text-xs text-muted-foreground">最后更新:{lastUpdated.toLocaleString("zh-CN")}</div>
            )}
          </header>

          <main>
            <Activity mode={activeTab === "games" ? "visible" : "hidden"}>
              <Games
                filteredPlatforms={filteredPlatforms}
                games={filteredGames}
                setPlatform={setPlatform}
                platform={platform}
                favoriteGames={preferences.favoriteGames}
                toggleFavoriteGame={toggleFavoriteGame}
                hideGame={hideGame}
                loading={loading}
              />
            </Activity>
            <Activity mode={activeTab === "favorites" ? "visible" : "hidden"}>
              <Favorites games={favoriteGames} toggleFavoriteGame={toggleFavoriteGame} hideGame={hideGame} />
            </Activity>
            <Activity mode={activeTab === "links" ? "visible" : "hidden"}>
              <PlatformLinks />
            </Activity>
          </main>

          <footer className="mt-16 text-center">
            <Card className="inline-block p-6 bg-primary/5 border-primary/20">
              <p className="text-sm text-muted-foreground">
                💡 <strong>小贴士:</strong>
                建议将此页面添加到收藏夹,定期查看最新的免费游戏信息!
              </p>
            </Card>
          </footer>
        </div>
      </div>
    </StairsPreloader>
  )
}

export default FreeGames
