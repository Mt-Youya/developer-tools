import { motion } from "framer-motion"
import { AlertTriangle, Home } from "lucide-react"
import { Link } from "react-router-dom"

const RACCOON_VIDEO_URL =
  "https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/videos/generated/131e814c-2206-4271-99a9-67b4cc0630a6.mp4"

function NotFoundPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
        setIsHovering(true)
      }
    }

    function handleMouseLeave() {
      setIsHovering(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.body.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.body.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black cursor-none select-none font-mono"
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      </div>

      <div className="relative w-full h-full flex flex-col items-center justify-center z-10">
        <div className="absolute inset-0 z-0 flex flex-1 items-center justify-center opacity-40 video-player">
          <video
            src={RACCOON_VIDEO_URL}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-80 mix-blend-screen"
          />
        </div>

        <div className="relative z-20 text-center space-y-8 px-4 max-w-2xl mt-48 md:mt-64">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative"
          >
            <h1 className="text-[8rem] md:text-[12rem] font-bold tracking-tighter leading-none text-white/5 mix-blend-overlay select-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              404
            </h1>
            <div className="bg-amber-500 text-black font-bold px-4 py-1 inline-block transform -rotate-2 mb-4 text-sm tracking-widest uppercase border-2 border-amber-600 shadow-lg">
              Case File #404
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2 drop-shadow-2xl">
              Missing In Action
            </h2>
            <p className="text-amber-100/80 text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed drop-shadow-md">
              "We've combed the perimeter. The page you're looking for has vanished into the void. It's clean... too
              clean."
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
          >
            <Link
              to="/"
              className="group relative overflow-hidden rounded-sm bg-amber-600 px-8 py-3 text-black font-bold uppercase tracking-wider transition-all hover:bg-amber-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Home className="w-5 h-5" />
                Abort Mission
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-white/20 transition-transform duration-300 skew-x-12" />
            </Link>

            <button
              type="button"
              className="px-8 py-3 rounded-sm border-2 border-white/20 text-white/60 uppercase tracking-wider font-bold hover:text-white hover:border-white/50 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <AlertTriangle className="w-5 h-5" />
              Report Incident
            </button>
          </motion.div>
        </div>
      </div>

      <div
        className="absolute inset-0 z-30 pointer-events-none mix-blend-multiply transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 300px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, rgba(0,0,0,0.98) 100%)`,
          opacity: isHovering ? 1 : 0, // Fade in effect when mouse enters
        }}
      />

      <div
        className="absolute inset-0 z-40 pointer-events-none transition-opacity duration-75"
        style={{
          background: `radial-gradient(circle 300px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, transparent 40%)`,
          opacity: isHovering ? 1 : 0,
        }}
      />

      <div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-50 mix-blend-difference"
        style={{
          transform: `translate(${mousePosition.x - 16}px, ${mousePosition.y - 16}px)`,
        }}
      >
        <div className="w-full h-full border-2 border-white rounded-full opacity-50 shadow-[0_0_10px_white]" />
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-amber-500 rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div
        className="absolute inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}

export default NotFoundPage
