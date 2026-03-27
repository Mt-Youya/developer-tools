import { motion } from "framer-motion"
import { AlertTriangle, Home, RefreshCw, Terminal } from "lucide-react"
import { withErrorBoundary } from "@/components/ErrorBoundary"
import { GlitchText } from "./components/GlitchText"
import { RobotCanvas } from "./components/Scene3D"

const SafeComponent = withErrorBoundary(RobotCanvas, {
  fallback: <div className="w-full h-full flex items-center justify-center text-red-500">3D Scene Failed to Load</div>,
})
export function ServerErrorPage() {
  "use memo"
  const navigate = useNavigate()
  const [logs, setLogs] = useState<string[]>([
    "> SYSTEM CRITICAL FAILURE DETECTED",
    "> ERROR CODE: 500",
    "> INITIATING RECOVERY PROTOCOL...",
  ])

  const [isRebooting, setIsRebooting] = useState(false)

  // Fake terminal log generation
  useEffect(() => {
    const interval = setInterval(() => {
      const messages = [
        "> RETRYING CONNECTION...",
        "> PACKET LOSS DETECTED",
        "> MEMORY LEAK IN SECTOR 7G",
        "> UNIT 734: 'I'M TRYING!'",
        "> RECALIBRATING...",
        "> SIGNAL WEAK",
        "> STACK OVERFLOW",
      ]
      const randomMsg = messages[Math.floor(Math.random() * messages.length)]
      setLogs((prev) => [...prev.slice(-6), `${randomMsg} [${new Date().toLocaleTimeString()}]`])
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  function handleReboot() {
    setIsRebooting(true)
    setLogs((prev) => [...prev, "> FORCED REBOOT INITIATED..."])
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden font-sans text-foreground selection:bg-primary selection:text-background">
      {/* 3D Scene Layer - Absolute Background */}
      <div className="absolute inset-0 z-0">
        <SafeComponent />
      </div>

      {/* Vignette Overlay for atmosphere */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-60" />

      {/* Content Grid */}
      <div className="relative z-20 container mx-auto h-full px-6 flex flex-col md:flex-row items-center justify-center md:justify-between gap-12 pointer-events-none">
        {/* Left Column: Text & Actions */}
        <div className="flex-1 max-w-2xl pt-20 md:pt-0 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            // transition={{ duration: 0.8, ease: "outCirc" }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-4 mb-2">
              <span className="px-3 py-1 rounded-full border border-accent/50 bg-accent/10 text-accent text-xs font-mono tracking-widest uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                System Offline
              </span>
            </div>

            <GlitchText text="500" size="xl" className="text-primary" />

            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-white to-white/50">
              INTERNAL SERVER ERROR
            </h2>

            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Something went wrong on our end. Unit 734 is currently attempting to fix the hyper-drive. Please remain
              calm.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                type="button"
                onClick={handleReboot}
                className="group relative px-6 py-3 bg-primary/10 hover:bg-primary/20 border border-primary/50 text-primary font-mono rounded overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center gap-2"
              >
                <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <RefreshCw className={`w-4 h-4 ${isRebooting ? "animate-spin" : ""}`} />
                <span>{isRebooting ? "REBOOTING..." : "REBOOT SYSTEM"}</span>
              </button>

              <button
                type="button"
                className="px-6 py-3 bg-secondary/10 hover:bg-secondary/20 border border-secondary/50 text-secondary-foreground font-mono rounded transition-all flex items-center gap-2"
                onClick={() => navigate("/home")}
              >
                <Home className="w-4 h-4" />
                <span>RETURN HOME</span>
              </button>
            </div>

            {/* Terminal Box */}
            <motion.div
              className="mt-12 p-4 rounded bg-black/80 border border-white/10 backdrop-blur-sm font-mono text-xs md:text-sm text-green-500/80 shadow-2xl max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2 pb-2 border-b border-white/5 mb-2 text-white/40">
                <Terminal className="w-3 h-3" />
                <span>DEBUG_CONSOLE.LOG</span>
              </div>
              <div className="h-32 overflow-hidden flex flex-col justify-end">
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="truncate"
                  >
                    {log}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Column: Space for Robot (Empty div to balance layout, RobotCanvas is behind) */}
        <div className="flex-1 h-[50vh] md:h-full w-full pointer-events-none" />
      </div>

      {/* Decorative Floating Elements */}
      <div className="absolute bottom-8 left-8 text-xs font-mono text-white/20 pointer-events-none z-20">
        ID: #ERR_500_SPARKY <br />
        LOC: SECTOR_09
      </div>

      <div className="absolute top-8 right-8 pointer-events-none z-20">
        <AlertTriangle className="w-12 h-12 text-accent/20" />
      </div>
    </div>
  )
}

export default ServerErrorPage
