import { Card, CardContent } from "@devtools/ui/Card";
import imagePlaceholder from "/public/assets/images/image-placeholder.png?url";
import { Badge } from "@devtools/ui/Badge";
import { Button } from "@devtools/ui/Button";
import { ExternalLink, Heart, EyeOff, Calendar } from "lucide-react";

function GameCard({ game, isFavorite, onToggleFavorite, onHide }) {
  function formatDate(dateString = "") {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("zh-CN");
  }

  function getImageSrc(src: string) {
    return src || imagePlaceholder;
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-0 gap-0">
      <div className="relative">
        <img
          src={getImageSrc(game.image)}
          alt={game.title}
          className="w-full h-48 object-cover rounded-t-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = imagePlaceholder;
          }}
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onToggleFavorite(game.id)}
            className={`opacity-0 group-hover:opacity-100 transition-opacity ${
              isFavorite ? "text-red-500" : ""
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onHide(game.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        </div>
        <Badge className="absolute top-2 left-2">{game.platform}</Badge>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">
          {game.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 h-10">
          {game.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-3 h-12">
          {game.genre &&
            game.genre.split(",").map((g, idx) => (
              <Badge variant="outline" className="text-xs h-fit" key={idx}>
                {g.trim()}
              </Badge>
            ))}
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
          开发商：{game.developer}
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
          <Calendar className="h-3 w-3" />
          <span>截止：{formatDate(game.endDate)}</span>
        </div>

        <Button asChild className="w-full">
          <a href={game.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            获取游戏
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

export default GameCard;
