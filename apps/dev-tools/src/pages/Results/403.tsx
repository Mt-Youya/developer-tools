import { cn } from "@devtools/libs"
import { Float, MeshReflectorMaterial, PerspectiveCamera } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { Bloom, ChromaticAberration, EffectComposer, Noise } from "@react-three/postprocessing"
import { motion } from "framer-motion"
import { ArrowLeft, KeyRound, Lock, ShieldAlert } from "lucide-react"
import type { ButtonHTMLAttributes, ReactNode } from "react"
import { type Group, type Mesh, MeshStandardMaterial, Vector2 } from "three"

interface LaserBeamProps {
  position: [number, number, number]
  color?: string
  delay?: number
}

function LaserBeam({ position, color = "#ff0000", delay = 0 }: LaserBeamProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    // Pulse effect
    const t = state.clock.getElapsedTime()
    const intensity = Math.sin(t * 3 + delay) * 0.5 + 0.8
    if (meshRef.current.material instanceof MeshStandardMaterial) {
      meshRef.current.material.emissiveIntensity = intensity * 4
    }
    // Subtle float
    meshRef.current.position.y = position[1] + Math.sin(t * 2 + delay) * 0.1
  })

  return (
    <mesh ref={meshRef} position={position}>
      <cylinderGeometry args={[0.05, 0.05, 15, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        transparent
        opacity={0.8}
        toneMapped={false}
      />
    </mesh>
  )
}

function LaserGrid() {
  const lasers = useMemo(() => {
    const items = []
    // Create a circular barrier
    const count = 12
    const radius = 6

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      // Skip the front entrance for a "path" look
      if (z > 2 && Math.abs(x) < 2) continue

      items.push(<LaserBeam key={i} position={[x, 0, z - 2]} color="#ff003c" delay={i * 0.5} />)
    }
    return items
  }, [])

  return <group>{lasers}</group>
}

function SecurityDrone() {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    // Orbiting motion
    groupRef.current.position.x = Math.cos(t * 0.5) * 8
    groupRef.current.position.z = Math.sin(t * 0.5) * 8 - 5
    groupRef.current.position.y = 4 + Math.sin(t) * 0.5
    groupRef.current.rotation.y = -t * 0.5
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <coneGeometry args={[0.5, 1, 4]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <pointLight color="#00f3ff" intensity={2} distance={10} />
    </group>
  )
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[50, 50]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={40}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#050505"
        metalness={0.5}
        mirror={0.5} // Mirror 0.5 means it reflects half the light
      />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1, 8]} fov={50} />
      <color attach="background" args={["#030005"]} />
      <fog attach="fog" args={["#030005", 5, 25]} />

      <ambientLight intensity={0.2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#00f3ff" />
      <pointLight position={[-10, 5, -10]} intensity={1} color="#ff003c" />

      <group position={[0, 0, -2]}>
        <LaserGrid />
        <SecurityDrone />
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <mesh position={[0, 2, 0]} rotation={[0, 0, Math.PI / 4]}>
            <torusGeometry args={[2.5, 0.05, 16, 100]} />
            <meshStandardMaterial color="#ff003c" emissive="#ff003c" emissiveIntensity={2} toneMapped={false} />
          </mesh>
          <mesh position={[0, 2, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <torusGeometry args={[2.2, 0.02, 16, 100]} />
            <meshStandardMaterial color="#ff003c" emissive="#ff003c" emissiveIntensity={1} toneMapped={false} />
          </mesh>
        </Float>
        <Floor />
      </group>

      <EffectComposer enableNormalPass>
        <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
        <Noise opacity={0.15} />
        <ChromaticAberration offset={new Vector2(0.002, 0.002)} radialModulation={false} modulationOffset={0} />
      </EffectComposer>
    </>
  )
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline"
  icon?: ReactNode
}

function CyberButton({ children, variant = "primary", icon, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "group relative flex items-center justify-center gap-2 px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest transition-all overflow-hidden",
        "before:absolute before:inset-0 before:z-[-1] before:transition-transform before:duration-300",
        variant === "primary" ? "text-black hover:text-white" : "text-primary hover:text-black",
        className
      )}
      {...props}
    >
      {/* Background Shapes */}
      <div
        className={cn(
          "absolute inset-0 z-[-1] border-2 transition-colors duration-300",
          variant === "primary"
            ? "bg-primary border-primary group-hover:bg-transparent"
            : "bg-transparent border-primary group-hover:bg-primary"
        )}
        style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
      />

      {/* Glitch Effect Elements */}
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {children}
      </span>

      {/* Corner Accents */}
      <div className="absolute top-0 right-0 h-2 w-2 border-t-2 border-r-2 border-white opacity-50" />
      <div className="absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 border-white opacity-50" />
    </button>
  )
}

export default function ForbiddenPage() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#30064a7a] text-foreground font-mono selection:bg-primary selection:text-black">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas dpr={[1, 2]}>
          <Scene />
        </Canvas>
      </div>

      {/* Grid Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 42, 42, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 42, 42, 0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Vignette & Scanline Overlay */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(3,0,5,0.8)_50%)]" />
      <div
        className="pointer-events-none absolute inset-0 z-20 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]"
        style={{ backgroundSize: "100% 2px, 3px 100%" }}
      />

      {/* Content Container */}
      <div className="relative z-30 flex h-full w-full flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-2xl text-center"
        >
          {/* Warning Icon with Pulse */}
          <div className="mb-6 flex justify-center">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm">
              <div className="absolute inset-0 animate-ping rounded-full border border-primary opacity-20 duration-1000" />
              <ShieldAlert className="h-12 w-12 text-primary" />
            </div>
          </div>

          {/* Glitchy 403 Title */}
          <div className="relative mb-2">
            <h1
              className="text-[120px] font-bold leading-none tracking-tighter text-transparent md:text-[180px]"
              style={{
                WebkitTextStroke: "2px rgba(255, 42, 42, 0.8)",
                textShadow: "0 0 20px rgba(255, 42, 42, 0.5)",
              }}
            >
              403
            </h1>
            <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none mix-blend-overlay">
              <h1 className="text-[120px] font-bold leading-none tracking-tighter text-primary opacity-50 blur-[2px] animate-pulse md:text-[180px]">
                403
              </h1>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-10 space-y-4">
            <h2 className="text-2xl font-bold uppercase tracking-[0.2em] text-white">
              Access <span className="text-primary">Denied</span>
            </h2>
            <p className="mx-auto max-w-md text-muted-foreground">
              You do not have clearance to access this sector. Security protocols have been engaged. Please retreat
              immediately.
            </p>

            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/60">
              <Lock className="h-3 w-3" />
              <span>System Locked • ID: 8X-299-F</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CyberButton
              variant="outline"
              onClick={() => window.history.back()}
              icon={<ArrowLeft className="h-4 w-4" />}
            >
              Go Back
            </CyberButton>

            <CyberButton
              variant="primary"
              onClick={() => console.log("Requesting access...")}
              icon={<KeyRound className="h-4 w-4" />}
            >
              Request Access
            </CyberButton>
          </div>
        </motion.div>

        {/* Bottom Decorative Footer */}
        <div className="absolute bottom-8 left-0 w-full px-8 flex justify-between text-[10px] text-muted-foreground/40 font-mono uppercase tracking-widest">
          <div>SEC_LEVEL: MAX</div>
          <div>NET_STATUS: OFFLINE</div>
          <div>TERMINAL: T-882</div>
        </div>
      </div>
    </div>
  )
}
