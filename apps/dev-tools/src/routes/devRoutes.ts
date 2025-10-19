import { IS_DEV } from "@devtools/libs";
import { lazy } from "react";

export const devRoutes = [
  {
    path: "/bogo",
    component: lazy(() => import("@/pages/BOGO")),
    redirect: !IS_DEV ? "/404" : undefined
  }
]
