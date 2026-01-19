import { cn } from "@devtools/libs"
import { ContactShadows, Environment, Float, OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { motion } from "framer-motion"
import { ArrowLeft, Fingerprint, ShieldAlert } from "lucide-react"
import * as THREE from "three"

// --- 3D Components ---

// Procedural Sci-Fi Droid
function Droid(props: any) {
  const group = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Group>(null)
  const scanLightRef = useRef<THREE.PointLight>(null)

  // Animation
  useFrame((state) => {
    if (!group.current || !ringRef.current || !scanLightRef.current) return

    const t = state.clock.getElapsedTime()

    // Gentle floating handled by Float component, but we add subtle local rotation
    group.current.rotation.y = Math.sin(t * 0.2) * 0.1

    // Scanning rings rotation
    ringRef.current.rotation.x = t * 0.5
    ringRef.current.rotation.y = t * 0.3

    // Scanning light movement (vertical scan)
    const scanPos = Math.sin(t * 2) * 1.5
    scanLightRef.current.position.y = scanPos
  })

  // Materials
  const metalMaterial = new THREE.MeshStandardMaterial({
    color: "#222",
    metalness: 0.8,
    roughness: 0.2,
  })

  const accentMaterial = new THREE.MeshStandardMaterial({
    color: "#06b6d4",
    metalness: 0.9,
    roughness: 0.1,
    emissive: "#06b6d4",
    emissiveIntensity: 0.5,
  })

  return (
    <group ref={group} {...props}>
      {/* Head */}
      <group position={[0, 1.2, 0]}>
        <mesh castShadow receiveShadow material={metalMaterial}>
          <sphereGeometry args={[0.6, 32, 32]} />
        </mesh>
        {/* Visor / Eye */}
        <mesh position={[0, 0.1, 0.5]} rotation={[0.1, 0, 0]}>
          <capsuleGeometry args={[0.15, 0.6, 4, 8]} />
          <meshStandardMaterial color="#000" emissive="#06b6d4" emissiveIntensity={2} toneMapped={false} />
        </mesh>
        {/* Antennas */}
        <mesh position={[0.4, 0.6, 0]} rotation={[0, 0, -0.5]} material={metalMaterial}>
          <cylinderGeometry args={[0.02, 0.02, 0.5]} />
        </mesh>
        <mesh position={[-0.4, 0.6, 0]} rotation={[0, 0, 0.5]} material={metalMaterial}>
          <cylinderGeometry args={[0.02, 0.02, 0.5]} />
        </mesh>
      </group>

      {/* Neck */}
      <mesh position={[0, 0.5, 0]} material={metalMaterial}>
        <cylinderGeometry args={[0.2, 0.3, 0.4]} />
      </mesh>

      {/* Body Core */}
      <group position={[0, -0.5, 0]}>
        {/* Main Chassis */}
        <mesh castShadow receiveShadow material={metalMaterial}>
          <cylinderGeometry args={[0.5, 0.4, 1.8, 32]} />
        </mesh>

        {/* Glowing Core */}
        <mesh position={[0, 0.2, 0.45]}>
          <circleGeometry args={[0.15, 32]} />
          <meshStandardMaterial color="#000" emissive="#ef4444" emissiveIntensity={3} />
        </mesh>

        {/* Side Panels */}
        <mesh position={[0.55, 0, 0]} material={accentMaterial}>
          <boxGeometry args={[0.1, 1.2, 0.6]} />
        </mesh>
        <mesh position={[-0.55, 0, 0]} material={accentMaterial}>
          <boxGeometry args={[0.1, 1.2, 0.6]} />
        </mesh>
      </group>

      {/* Holographic Rings */}
      <group ref={ringRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.5, 0.02, 16, 100]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.3} />
        </mesh>
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[2.2, 0.01, 16, 100]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.2} />
        </mesh>

        {/* Floating Data particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos(i * (Math.PI / 4)) * 2.5,
              (Math.random() - 0.5) * 0.5,
              Math.sin(i * (Math.PI / 4)) * 2.5,
            ]}
          >
            <boxGeometry args={[0.05, 0.05, 0.05]} />
            <meshBasicMaterial color="#06b6d4" />
          </mesh>
        ))}
      </group>

      {/* Scanning Light Source */}
      <pointLight ref={scanLightRef} color="#ef4444" intensity={2} distance={3} decay={2} />
    </group>
  )
}

// Scene Composition
function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 2.2} />

      {/* Environment */}
      {/* We use the theme background color for the scene fog and background */}
      <color attach="background" args={["#020617"]} />
      <fog attach="fog" args={["#020617", 5, 20]} />
      <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/rogland_clear_night_1k.hdr" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={10} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={5} color="#06b6d4" />

      {/* Floating Robot */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Droid />
      </Float>

      {/* Ground Reflections */}
      <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#06b6d4" />

      {/* Floor Grid Effect (Visual only) */}
      <gridHelper args={[20, 20, "#1e293b", "#0f172a"]} position={[0, -2.5, 0]} />
    </>
  )
}

// --- UI Components ---

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary"
  icon?: React.ReactNode
}

function Button({ children, variant = "primary", className, icon, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "relative overflow-hidden group flex items-center justify-center gap-2 px-6 py-3 rounded-sm font-sans font-bold tracking-widest text-sm transition-all duration-300",
        variant === "primary" &&
          "bg-primary/10 border border-primary/50 text-primary hover:bg-primary/20 hover:border-primary hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]",
        variant === "secondary" &&
          "bg-secondary/50 border border-border text-muted-foreground hover:bg-secondary hover:text-foreground",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {children}
      </span>
      {/* Glitch effect overlay on hover */}
      <span className="absolute inset-0 translate-y-full group-hover:translate-y-0 bg-linear-to-t from-primary/20 to-transparent transition-transform duration-300" />
    </button>
  )
}

function GlitchText({ text }: { text: string }) {
  return (
    <div className="relative inline-block group">
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-destructive opacity-0 group-hover:opacity-70 group-hover:translate-x-[2px] transition-all duration-100 select-none animate-pulse">
        {text}
      </span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-primary opacity-0 group-hover:opacity-70 group-hover:-translate-x-[2px] transition-all duration-100 select-none animate-pulse delay-75">
        {text}
      </span>
    </div>
  )
}

// --- Main Component ---

export function Atlas401Error() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-background font-sans text-foreground selection:bg-primary/30">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows dpr={[1, 2]}>
          <Scene />
        </Canvas>
      </div>

      {/* Vignette & Scanlines Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_90%)]" />
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
          backgroundSize: "100% 2px, 3px 100%",
        }}
      />

      {/* Main Content UI */}
      <div className="relative z-20 flex flex-col items-start justify-center h-full px-8 md:px-24 max-w-7xl mx-auto">
        {/* Top Left System Status */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-8 left-8 md:left-24 flex items-center gap-4 text-xs tracking-[0.2em] text-primary/60 font-mono"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive/75 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
            </span>
            {/** biome-ignore lint: false positive */}
            SYSTEM ALERT // UNIDENTIFIED USER
          </div>
          <div className="h-px w-16 bg-border" />
          <div>SEC-LEVEL: 401</div>
        </motion.div>

        {/* Hero Content */}
        <div className="space-y-6 max-w-lg backdrop-blur-sm bg-background/30 p-8 rounded-lg border border-border/50 shadow-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-4 mb-2"
          >
            <ShieldAlert className="w-8 h-8 text-destructive" />
            <div className="h-px flex-1 bg-linear-to-r from-destructive/50 to-transparent" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-8xl md:text-9xl font-bold font-sans leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-foreground to-muted-foreground"
          >
            <GlitchText text="401" />
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-2xl md:text-3xl font-light tracking-wide text-primary-foreground">
              Identity Not Verified
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base border-l-2 border-primary/30 pl-4">
              Access to the ATLAS Core system is restricted to authorized personnel only. Your biometric signature does
              not match any known records in our database.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Button variant="primary" icon={<Fingerprint className="w-4 h-4" />}>
              AUTHENTICATE
            </Button>
            <Button variant="secondary" icon={<ArrowLeft className="w-4 h-4" />}>
              RETURN HOME
            </Button>
          </motion.div>
        </div>

        {/* Bottom Metadata */}
        <div className="absolute bottom-8 left-8 md:left-24 right-8 flex justify-between items-end text-[10px] text-muted-foreground font-mono tracking-widest uppercase">
          <div>
            <div>Error Code: 0x401_AUTH_FAIL</div>
            <div>Ref: ATLAS_SEC_NODE_7734</div>
          </div>
          <div className="text-right">
            <div>System Integrity: 98.4%</div>
            <div>Uptime: 4192h 14m 22s</div>
          </div>
        </div>

        {/* Decorative Grid Lines */}
        <div className="absolute top-0 bottom-0 left-12 md:left-20 w-px bg-border/30 z-0 hidden md:block" />
        <div className="absolute top-24 bottom-24 right-24 w-px bg-border/30 z-0 hidden md:block" />
      </div>
    </div>
  )
}

export default Atlas401Error
