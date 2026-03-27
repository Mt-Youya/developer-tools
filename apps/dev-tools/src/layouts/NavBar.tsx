import type { TakeOut } from "@devtools/shared"
import { Link, useMatch } from "react-router"
import { routesConfig } from "@/routes/router"
import { getWeather } from "@/services/weather"

type Result = TakeOut<ReturnType<typeof getWeather>>
function NavBar() {
  "use no memo"
  const [weather, setWeather] = useState<Result | null>(null)

  const weatherReq = getWeather()
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords
      console.log("latitude, longitude", latitude, longitude)
    })
    weatherReq({ location: "101010300" }).then(({ data }) => setWeather(data))
  }, [])
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
  const navClass = "text-xs font-medium text-gray-800 hover:text-gray-600 transition-colors whitespace-nowrap"
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
          <div className="flex justify-center items-center">
            <p className="mr-2">
              <span> 北京 </span>
            </p>
            <p className="flex gap-1 flex-col justify-center items-start">
              <span className="text-sm block px-1">天气: {weatherNow?.cond_txt}</span>
              <span className="text-sm block px-1">湿度: {weatherNow?.hum}%</span>
            </p>

            <p className="flex gap-1 flex-col justify-center items-start">
              <span className="text-sm block px-1">温度: {weatherNow?.tmp}℃</span>
              <span className="text-sm block px-1">
                风力: {weatherNow?.wind_dir} {weatherNow?.wind_sc}级
              </span>
            </p>
          </div>

          <div className="md:flex items-center space-x-6">
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
