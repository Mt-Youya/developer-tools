import { cn } from "@devtools/libs"
import type { DIV } from "@devtools/shared"

function Skeleton({ className, ...props }: DIV) {
  "use memo"
  return <div data-slot="skeleton" className={cn("bg-accent animate-pulse rounded-md", className)} {...props} />
}

function SkeletonCard() {
  "use memo"
  return (
    <div className="p-5 h-10 space-y-3 relative z-20">
      <Skeleton className="h-12 w-3/5" style={{ animationDelay: "0ms" }} />
      <Skeleton className="h-12 w-full" style={{ animationDelay: "100ms" }} />
      <Skeleton className="h-12 w-11/12" style={{ animationDelay: "200ms" }} />
      <Skeleton className="h-12 w-[95%]" style={{ animationDelay: "300ms" }} />
    </div>
  )
}

function SkeletonAvatar() {
  "use memo"
  return (
    <div className="flex items-center gap-4 p-5">
      <Skeleton className="w-12 h-12 animate-scale-in rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-1/3 animate-slide-up" style={{ animationDelay: "100ms" }} />
        <Skeleton className="w-1/2 animate-slide-up" style={{ animationDelay: "200ms" }} />
      </div>
    </div>
  )
}
export { Skeleton, SkeletonAvatar, SkeletonCard }
