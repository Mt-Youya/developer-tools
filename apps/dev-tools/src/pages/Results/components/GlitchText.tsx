import { motion } from "framer-motion"

interface GlitchTextProps {
  text: string
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

/**
 * Renders text with a cyberpunk glitch effect.
 * Uses CSS clip-path animations simulated via multiple layers.
 */
export function GlitchText({ text, className = "", size = "lg" }: GlitchTextProps) {
  const sizeClasses = {
    sm: "text-xl font-bold",
    md: "text-4xl font-black",
    lg: "text-6xl font-black",
    xl: "text-8xl font-black tracking-tighter",
  }

  return (
    <div className={`relative inline-block group ${className}`}>
      <span className={`relative z-10 block ${sizeClasses[size]}`}>{text}</span>

      {/* Glitch Layer 1 - Cyan offset */}
      <span
        className={`absolute top-0 left-0 -z-10 w-full h-full text-primary opacity-0 group-hover:opacity-70 animate-pulse translate-x-[2px] ${sizeClasses[size]}`}
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)", animationDuration: "2s" }}
      >
        {text}
      </span>

      {/* Glitch Layer 2 - Red offset */}
      <span
        className={`absolute top-0 left-0 -z-10 w-full h-full text-accent opacity-0 group-hover:opacity-70 animate-pulse -translate-x-[2px] translate-y-[1px] ${sizeClasses[size]}`}
        style={{ clipPath: "polygon(0 80%, 100% 20%, 100% 100%, 0 100%)", animationDuration: "3s" }}
      >
        {text}
      </span>

      {/* Glitch Layer 3 - Random slices */}
      <motion.span
        className={`absolute top-0 left-0 -z-10 w-full h-full text-white mix-blend-overlay ${sizeClasses[size]}`}
        initial={{ opacity: 0, x: 0 }}
        animate={{
          opacity: [0, 1, 0, 0, 0.5, 0],
          x: [-2, 2, -1, 3, 0],
          y: [1, -1, 0, 2, 0],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 4,
          repeatDelay: 2,
        }}
      >
        {text}
      </motion.span>
    </div>
  )
}
