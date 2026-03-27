/**
 * UnauthorizedErrorPage Component
 *
 * A futuristic, sci-fi themed 401 error page.
 * Features:
 * - Glitch text effects
 * - Animated robotic assistant core
 * - Scanline background overlay
 * - Glassmorphism UI elements
 * - Interactive buttons with neon glow effects
 */

import { cn } from "@devtools/libs"
import { AnimatePresence, motion } from "framer-motion"
import { AlertTriangle, ArrowLeft, Lock, RefreshCw, ShieldAlert } from "lucide-react"
import type { ReactNode } from "react"

function ScanlineOverlay() {
  "use memo"
  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden opacity-[0.15]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] bg-repeat" />
      <motion.div
        initial={{ top: "-100%" }}
        animate={{ top: "100%" }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute h-25 w-full bg-linear-to-b from-transparent via-primary/20 to-transparent"
      />
    </div>
  )
}

function GlitchText({ text, className }: { text: string; className?: string }) {
  "use memo"
  return (
    <div className={cn("relative inline-block", className)}>
      <motion.span
        className="relative z-10 block"
        animate={{
          x: [0, -2, 2, -1, 0],
          y: [0, 1, -1, 0],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 2,
          repeatType: "mirror",
        }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute left-0 top-0 -z-10 block text-secondary opacity-70 mix-blend-screen"
        animate={{
          x: [0, -4, 4, 0],
          opacity: [0.7, 0.4, 0.7],
        }}
        transition={{
          duration: 0.4,
          repeat: Infinity,
          repeatDelay: 2,
        }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute left-0 top-0 -z-10 block text-accent opacity-70 mix-blend-screen"
        animate={{
          x: [0, 2, -2, 0],
          opacity: [0.7, 0.4, 0.7],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 2,
        }}
      >
        {text}
      </motion.span>
    </div>
  )
}

function RoboticCore() {
  "use memo"
  return (
    <div className="relative flex h-64 w-64 items-center justify-center">
      {/* Outer rotating ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border border-primary/20 border-t-primary shadow-[0_0_30px_rgba(0,243,255,0.2)]"
      />

      {/* Middle counter-rotating ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-4 rounded-full border border-secondary/20 border-b-secondary/80"
      />

      {/* Inner pulsing core */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-16 flex items-center justify-center rounded-full bg-primary/10 backdrop-blur-md"
      >
        <div className="h-20 w-20 rounded-full bg-linear-to-tr from-primary to-secondary opacity-80 blur-md" />
      </motion.div>

      {/* Center Icon */}
      <div className="z-10 text-primary">
        <Lock className="h-12 w-12" />
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            x: Math.cos(i * 60 * (Math.PI / 180)) * 100,
            y: Math.sin(i * 60 * (Math.PI / 180)) * 100,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}

interface SciFiButtonProps {
  children: ReactNode
  variant?: "primary" | "secondary"
  onClick?: () => void
}

function SciFiButton({ children, variant = "primary", onClick }: SciFiButtonProps) {
  "use memo"
  return (
    <motion.button
      // whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "group relative flex items-center justify-center gap-2 overflow-hidden px-8 py-3 font-mono text-sm tracking-widest uppercase transition-all",
        variant === "primary"
          ? "bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(0,243,255,0.4)]"
          : "bg-transparent text-muted-foreground hover:text-blue-600 border border-white/10 hover:border-white/30"
      )}
    >
      {/* Corner accents */}
      <span className="absolute left-0 top-0 h-2 w-2 border-l border-t border-current opacity-50 transition-opacity group-hover:opacity-100" />
      <span className="absolute right-0 top-0 h-2 w-2 border-r border-t border-current opacity-50 transition-opacity group-hover:opacity-100" />
      <span className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-current opacity-50 transition-opacity group-hover:opacity-100" />
      <span className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-current opacity-50 transition-opacity group-hover:opacity-100" />
      {children}
    </motion.button>
  )
}

export default function UnauthorizedErrorPage() {
  "use memo"
  const [typedText, setTypedText] = useState("")
  const fullText = "ACCESS DENIED // IDENTITY NOT VERIFIED"

  const navigate = useNavigate()

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index))
      index++
      if (index > fullText.length) clearInterval(interval)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background font-sans text-foreground selection:bg-primary/30 selection:text-primary">
      <ScanlineOverlay />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #4f4f4f 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-2xl w-full"
        >
          <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-2 text-xs font-mono text-muted-foreground">
            <span>SYS.ERR.401</span>
            <span className="animate-pulse text-destructive">● CRITICAL FAILURE</span>
            <span>{new Date().toISOString().split("T")[0]}</span>
          </div>

          <div className="flex flex-col items-center gap-10">
            <RoboticCore />

            <div className="text-center">
              <h1
                className="font-mono text-8xl font-black tracking-tighter text-transparent"
                style={{ WebkitTextStroke: "2px var(--primary)" }}
              >
                <GlitchText text="401" />
              </h1>

              <div className="mt-4 h-8 font-mono text-sm tracking-[0.2em] text-destructive">
                {typedText}
                <span className="animate-pulse">_</span>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-6 max-w-md text-center text-muted-foreground"
              >
                The server could not verify your identity. Please provide valid authentication credentials to proceed
                beyond this checkpoint.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <SciFiButton variant="primary" onClick={() => navigate("/login")}>
                <RefreshCw className="h-4 w-4" />
                <span>Re-Authenticate</span>
              </SciFiButton>

              <SciFiButton variant="secondary" onClick={() => navigate("/")}>
                <ArrowLeft className="h-4 w-4" />
                <span>Return to Base</span>
              </SciFiButton>
            </motion.div>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-4 border-t border-white/10 pt-4 font-mono text-[10px] text-muted-foreground opacity-50">
            <div>
              <p>ENCRYPTION: AES-256</p>
              <p>STATUS: LOCKED</p>
            </div>
            <div className="text-center">
              <p>SECURITY LEVEL: 5</p>
            </div>
            <div className="text-right">
              <p>NODE: US-EAST-1</p>
              <p>LATENCY: 42ms</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 h-125 w-125 rounded-full bg-primary/5 blur-[100px]" />
      <div className="pointer-events-none absolute right-0 top-0 h-125 w-125 rounded-full bg-secondary/5 blur-[100px]" />
    </div>
  )
}
