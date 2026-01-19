import type { TakeOut } from "@devtools/shared"
import { Link, useMatch } from "react-router"
import { routesConfig } from "@/routes/router"
import { getWeather } from "@/services/weather"

function NavBar() {
  const resultsPages = [
    useMatch("/unauthorized"),
    useMatch("/forbidden"),
    useMatch("/not-found"),
    useMatch("/internal-error"),
  ]
  for (const match of resultsPages) {
    if (match) {
      return null
    }
  }
  type Result = TakeOut<typeof weatherReq>
  const navClass = "text-xs font-medium text-gray-800 hover:text-gray-600 transition-colors whitespace-nowrap"
  const [weather, setWeather] = useState<Result | null>(null)

  const weatherReq = getWeather()
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords
      console.log("latitude, longitude", latitude, longitude)
    })
    weatherReq({ location: "101010300" }).then(({ data }) => {
      console.log("weather data:", data)
      setWeather(data)
    })
  }, [])

  const weatherNow = weather?.now

  return (
    <nav className="sticky top-0 z-10 bg-white/40 backdrop-blur-xl shadow-sm">
      <div className="max-w-7-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11">
          <div className="shrink-0">
            <Link to="/" className="text-xl font-semibold hover:text-gray-600 transition-colors">
              Developer Tools
            </Link>
          </div>
          <div>
            <p className="flex gap-0.5 justify-center items-center">
              <span className="text-sm px-4 py-1">天气: {weatherNow?.cond_txt}</span>
              <span className="text-sm px-4 py-1">湿度: {weatherNow?.hum}%</span>
            </p>

            <p className="flex gap-0.5 justify-center items-center">
              <span className="text-sm px-4 py-1">温度: {weatherNow?.tmp}℃</span>
              <span className="text-sm px-4 py-1">
                风力: {weatherNow?.wind_dir} {weatherNow?.wind_sc}级
              </span>
            </p>
          </div>

          <div className="md:flex items-center space-x-8">
            {routesConfig.map((item) => (
              <NavLink key={item.name} item={item} className={navClass} />
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ item, className }: { item: (typeof routesConfig)[number]; className: string }) {
  // const isActive = useMatch(item.to)
  const resolved = useResolvedPath(item.to)
  const isActive = useMatch({ path: resolved.pathname, end: true })

  return (
    <Link to={item.to} className={`${className} ${isActive ? "text-gray-900" : ""}`}>
      {item.title}
    </Link>
  )
}

export default NavBar
