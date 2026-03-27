"use client"

import { useMeasure } from "@devtools/hooks"
import { cn } from "@devtools/libs"
import { Command, Grid, Rocket, Search, Sparkles } from "lucide-react"
import { AnimatePresence, motion, useMotionValue, useTransform } from "motion/react"

const Twitter = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-twitter-icon lucide-twitter"
  >
    <title>Twitter</title>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)
const Github = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-github-icon lucide-github"
  >
    <title>GitHub</title>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)
// Type definitions
export interface QuickActionItem {
  icon: typeof Command
  text: string
  shortcut?: string
  onClick?: () => void
}

export interface ExploreItem {
  icon: typeof Command
  text: string
  count?: number
  onClick?: () => void
}

export interface CustomizeOption {
  text: string
  options: string[]
}

export interface ConnectItem {
  icon: typeof Command
  text: string
  href?: string
}

export interface NavItem {
  icon: typeof Command
  name: string
}

type ViewType = "default" | "quick" | "explore" | "customize" | "connect"

interface DockIconProps {
  icon: typeof Command
  isActive: boolean
  onClick: () => void
  mouseX: ReturnType<typeof useMotionValue<number>>
  name: string
}
// Dock icon component with magnification effect
function DockIcon({ icon: Icon, isActive, onClick, mouseX, name }: DockIconProps) {
  const ref = useRef<HTMLButtonElement>(null)

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const width = useTransform(distance, [-100, 0, 100], [44, 60, 44])
  const scale = useTransform(distance, [-100, 0, 100], [1, 1.4, 1])
  const y = useTransform(distance, [-100, 0, 100], [0, -8, 0])

  return (
    <motion.button
      ref={ref}
      style={{ width, scale, y }}
      className={cn(
        "relative flex items-center justify-center rounded-xl p-3 transition-colors",
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      )}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      aria-label={name}
      aria-expanded={isActive}
      aria-haspopup="menu"
    >
      {isActive && (
        <motion.div
          layoutId="toolbar-active"
          className="bg-accent absolute inset-0 rounded-xl"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}
      <Icon size={22} className="relative z-10" />
    </motion.button>
  )
}

export interface BottomMenuProps {
  /** Main navigation items */
  navItems?: NavItem[]
  /** Quick action items */
  quickItems?: QuickActionItem[]
  /** Explore/category items */
  exploreItems?: ExploreItem[]
  /** Customization options */
  customizeItems?: CustomizeOption[]
  /** Social/connect links */
  connectItems?: ConnectItem[]
  /** Additional CSS classes */
  className?: string
  /** Callback when customize options change */
  onCustomizeChange?: (type: string, index: number) => void
  /** Default customize values */
  defaultCustomizeValues?: Record<string, number>
  /** Position of the menu */
  position?: Position
}
enum Position {
  Bottom = "bottom",
  Top = "top",
}

export function BottomMenu({
  navItems,
  quickItems,
  exploreItems,
  customizeItems,
  connectItems,
  className,
  onCustomizeChange,
  defaultCustomizeValues,
  position = Position.Top,
}: BottomMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hiddenRef, hiddenBounds] = useMeasure()
  const [view, setView] = useState<ViewType>("default")
  const [customValues, setCustomValues] = useState<Record<string, number>>(
    defaultCustomizeValues ?? { Radius: 2, Scale: 2 }
  )
  const mouseX = useMotionValue(Infinity)

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setView("default")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && view !== "default") {
        setView("default")
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [view])

  function handleCustomizeChange(text: string, index: number) {
    setCustomValues((prev) => ({ ...prev, [text]: index }))
    onCustomizeChange?.(text, index)
  }

  const content = (() => {
    const animationProps = {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
    }

    switch (view) {
      case "default":
        return null

      case "quick":
        return (
          <div className="min-w-[240px] p-2" role="menu">
            <p className="text-muted-foreground mb-2 px-2 text-xs font-medium tracking-wider uppercase">
              Quick Actions
            </p>
            <div className="space-y-1">
              {quickItems?.map(({ icon: Icon, text, shortcut, onClick }, i) => (
                <motion.button
                  key={text}
                  {...animationProps}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  onClick={onClick}
                  className="group hover:bg-muted/80 flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition-colors"
                  role="menuitem"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-110">
                      {/* <Twitter icon={Icon} size={18} className="text-foreground" /> */}
                      <Twitter />
                    </div>
                    <span className="text-foreground text-sm font-medium">{text}</span>
                  </div>
                  {shortcut && (
                    <kbd className="bg-muted text-muted-foreground rounded-md px-2 py-1 font-mono text-xs">
                      {shortcut}
                    </kbd>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        )

      case "explore":
        return (
          <div className="min-w-[220px] p-2" role="menu">
            <p className="text-muted-foreground mb-2 px-2 text-xs font-medium tracking-wider uppercase">Explore</p>
            <div className="space-y-1">
              {exploreItems?.map(({ icon: Icon, text, count, onClick }, i) => (
                <motion.button
                  key={text}
                  {...animationProps}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  onClick={onClick}
                  className="group hover:bg-muted/80 flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition-colors"
                  role="menuitem"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="from-primary/20 to-primary/5 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br"
                      whileHover={{
                        rotate: [0, -10, 10, 0],
                        transition: { duration: 0.4 },
                      }}
                    >
                      <Twitter size={18} className="text-primary" />
                    </motion.div>
                    <span className="text-foreground text-sm font-medium">{text}</span>
                  </div>
                  {count !== undefined && (
                    <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-semibold">
                      {count}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        )

      case "customize":
        return (
          <div className="min-w-[260px] p-2" role="menu">
            <p className="text-muted-foreground mb-3 px-2 text-xs font-medium tracking-wider uppercase">Customize</p>
            <div className="space-y-4 px-1">
              {customizeItems?.map(({ text, options }, idx) => (
                <motion.div key={text} {...animationProps} transition={{ delay: idx * 0.05, duration: 0.2 }}>
                  <p className="text-foreground mb-2 text-sm font-medium">{text}</p>
                  <div className="bg-muted/50 flex gap-1 rounded-xl p-1" role="radiogroup" aria-label={text}>
                    {options?.map((opt, i) => {
                      const isActive = (customValues[text] ?? 0) === i
                      return (
                        <motion.button
                          key={opt}
                          onClick={() => handleCustomizeChange(text, i)}
                          className={cn(
                            "relative flex-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors",
                            isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                          )}
                          whileTap={{ scale: 0.95 }}
                          role="radio"
                          aria-checked={isActive}
                        >
                          {isActive && (
                            <motion.div
                              layoutId={`customize-${text}`}
                              className="bg-background absolute inset-0 rounded-lg shadow-sm"
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 35,
                              }}
                            />
                          )}
                          <span className="relative z-10">{opt}</span>
                        </motion.button>
                      )
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )

      case "connect":
        return (
          <div className="min-w-[200px] p-2" role="menu">
            <p className="text-muted-foreground mb-2 px-2 text-xs font-medium tracking-wider uppercase">Connect</p>
            <div className="flex justify-center gap-2 py-2">
              {connectItems?.map(({ icon: Icon, text, href }, i) => (
                <motion.a
                  key={text}
                  href={href ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...animationProps}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  whileHover={{ y: -4, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-muted hover:bg-accent flex h-12 w-12 items-center justify-center rounded-2xl transition-colors"
                  title={text}
                  role="menuitem"
                >
                  <Twitter icon={Icon} size={22} className="text-foreground" />
                </motion.a>
              ))}
            </div>
            <p className="text-muted-foreground mt-2 text-center text-xs">Join the community</p>
          </div>
        )

      default:
        return null
    }
  })()

  return (
    <div ref={containerRef} className={cn("relative flex flex-col items-center z-10", className)}>
      {/* Hidden for measurement */}
      <div ref={hiddenRef} className="pointer-events-none invisible absolute top-[-9999px] left-[-9999px]">
        <div className="border-border bg-background/95 rounded-2xl border py-1">{content}</div>
      </div>

      {/* Animated submenu */}
      <AnimatePresence mode="wait">
        {view !== "default" && (
          <motion.div
            key="submenu"
            initial={{
              opacity: 0,
              scaleY: 0.9,
              scaleX: 0.95,
              height: 0,
              width: 0,
              originY: 1,
              originX: 0.5,
            }}
            animate={{
              opacity: 1,
              scaleY: 1,
              scaleX: 1,
              height: hiddenBounds.height || "auto",
              width: hiddenBounds.width || "auto",
              originY: 1,
              originX: 0.5,
            }}
            exit={{
              opacity: 0,
              scaleY: 0.9,
              scaleX: 0.95,
              height: 0,
              width: 0,
              originY: 1,
              originX: 0.5,
            }}
            transition={{
              duration: 0.3,
              ease: [0.45, 0, 0.25, 1],
            }}
            style={{
              transformOrigin: "bottom center",
            }}
            className={cn("absolute overflow-hidden", position === Position.Bottom ? "bottom-16" : "top-20")}
          >
            <div className="border-border bg-background/95 rounded-2xl border backdrop-blur-xl">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={view}
                  initial={{
                    opacity: 0,
                    scale: 0.96,
                    filter: "blur(10px)",
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                    filter: "blur(12px)",
                  }}
                  transition={{
                    duration: 0.25,
                    ease: [0.42, 0, 0.58, 1],
                  }}
                >
                  {content}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toolbar with Mac dock magnification effect */}
      <motion.div
        className="bg-background/95 z-10 mt-3 flex items-center gap-1 rounded-2xl border border-none p-1.5 backdrop-blur-xl"
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        role="menubar"
      >
        {navItems?.map(({ icon, name }) => (
          <DockIcon
            key={name}
            icon={icon}
            name={name}
            isActive={view === name}
            onClick={() => setView(view === name ? "default" : (name as ViewType))}
            mouseX={mouseX}
          />
        ))}
      </motion.div>
    </div>
  )
}

// Default data
export const DEFAULT_NAV_ITEMS: NavItem[] = [
  { icon: Command, name: "quick" },
  { icon: Sparkles, name: "explore" },
  { icon: Grid, name: "customize" },
  { icon: Github, name: "connect" },
]

export const DEFAULT_QUICK_ITEMS: QuickActionItem[] = [
  { icon: Search, text: "Search", shortcut: "⌘K" },
  { icon: Rocket, text: "Quick Start", shortcut: "⌘⇧N" },
  { icon: Twitter, text: "Playground", shortcut: "⌘P" },
]

export const DEFAULT_EXPLORE_ITEMS: ExploreItem[] = [
  { icon: Sparkles, text: "Animations", count: 24 },
  { icon: Github, text: "3D Effects", count: 12 },
  { icon: Grid, text: "Layouts", count: 18 },
]

export const DEFAULT_CUSTOMIZE_ITEMS: CustomizeOption[] = [
  { text: "Radius", options: ["None", "SM", "MD", "LG"] },
  { text: "Scale", options: ["90%", "95%", "100%", "105%"] },
]

export const DEFAULT_CONNECT_ITEMS: ConnectItem[] = [
  { icon: Github, text: "GitHub", href: "https://github.com" },
  { icon: Twitter, text: "Twitter", href: "https://twitter.com" },
  { icon: Search, text: "Discord", href: "https://discord.com" },
]

export function BottomMenuDemo() {
  return (
    <BottomMenu
      navItems={DEFAULT_NAV_ITEMS}
      quickItems={DEFAULT_QUICK_ITEMS}
      exploreItems={DEFAULT_EXPLORE_ITEMS}
      customizeItems={DEFAULT_CUSTOMIZE_ITEMS}
      connectItems={DEFAULT_CONNECT_ITEMS}
    />
  )
}
