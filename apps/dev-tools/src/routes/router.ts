import Unauthorized from "@/pages/Results/401"
import Forbidden from "@/pages/Results/403"
import NotFound from "@/pages/Results/404"
import InternalError from "@/pages/Results/500"
import Fake401 from "@/pages/Results/Fake/401"
import Fake403 from "@/pages/Results/Fake/403"
import Fake404 from "@/pages/Results/Fake/404"
import Fake500 from "@/pages/Results/Fake/500"

// const results = [
//   { name: "Unauthorized", to: "/invalid-expiration", title: "Unauthorized", component: Four01 },
//   { name: "Forbidden", to: "/forbidden", title: "Forbidden", component: Four03 },
//   { name: "Not Found", to: "/not-found", title: "Not Found", component: Four04 },
//   { name: "Internel Error", to: "/internal-error", title: "Internel Error", component: Five00 },
// ]

const results = [
  { name: "Unauthorized", to: "/unauthorized", title: "Unauthorized", component: Unauthorized },
  { name: "Forbidden", to: "/forbidden", title: "Forbidden", component: Forbidden },
  { name: "Not Found", to: "/not-found", title: "Not Found", component: NotFound },
  { name: "Internel Error", to: "/internal-error", title: "Internel Error", component: Fake500 },
]

async function getPages() {
  const glob = await import.meta.glob("../pages/**/index.tsx", { eager: true, import: "default" })
  const routes = []
  for (const [key, value] of Object.entries(glob)) {
    const k = key.replace("../pages/", "").replace("/index.tsx", "")
    routes.push({
      name: k,
      to: k
        .replace(/([a-z\d])([A-Z])/g, "$1-$2")
        .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, "$1-$2")
        .toLowerCase(),
      title: k
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
        .replace(/([a-z\d])([A-Z])/g, "$1 $2")
        .trim(),
      component: value as React.FunctionComponent,
    })
  }
  return routes
}

const routes = await getPages()
const homeIdx = routes.findIndex((item) => item.name === "Home")
const Home = routes[homeIdx]
routes.splice(homeIdx, 1)
export const routesConfig = [Home, ...routes]

export default [{ ...Home, to: "/" }, ...routesConfig, ...results]
