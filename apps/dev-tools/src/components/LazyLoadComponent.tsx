import { type ComponentType, Suspense } from "react"

export const LazyLoad = ({ component: Component }: { component: ComponentType }) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Component />
  </Suspense>
)
