/**
 * The 3D Scene component handling the R3F canvas content.
 * Includes:
 * - Background robot image
 * - Digital barrier effects
 * - Particle systems
 * - Lighting setup
 */

import { Float, Image, PerspectiveCamera, Sparkles, Stars } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

// Asset URL for the robot
const ROBOT_IMG =
  "https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/projects/fb345f18-bc3b-488a-895f-665d245abc2d/generated-images/generated-35bab1be-23e8-4bc0-82df-b0cca00f10a2.png"

function Barrier() {
  const meshRef = useRef<THREE.Mesh>(null)

  // Custom shader for the digital barrier
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#ef4444") },
    }),
    []
  )

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;

    // Pseudo-random function
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      // Hexagon grid pattern (simplified)
      vec2 st = vUv * 20.0;
      vec2 ipos = floor(st);
      
      // Glitch movement
      float glitch = step(0.98, random(vec2(uTime * 0.5, vUv.y)));
      float offset = glitch * 0.1 * sin(uTime * 10.0);
      
      // Grid lines
      float line = smoothstep(0.0, 0.1, abs(sin(st.x * 3.14 + offset))) * 
                   smoothstep(0.0, 0.1, abs(sin(st.y * 3.14)));
      
      // Pulse effect
      float pulse = 0.5 + 0.5 * sin(uTime * 2.0 + vUv.y * 5.0);
      
      // Scanline
      float scan = smoothstep(0.4, 0.5, fract(vUv.y - uTime * 0.2));
      
      // Alpha calculation
      float alpha = (1.0 - line) * 0.15 * pulse + scan * 0.1;
      alpha += glitch * 0.3;
      
      // Vignette to fade edges
      float dist = distance(vUv, vec2(0.5));
      alpha *= smoothstep(0.8, 0.2, dist);

      gl_FragColor = vec4(uColor, alpha);
    }
  `

  return (
    <mesh ref={meshRef} position={[0, 0, 2]} scale={[14, 8, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        transparent
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

function FloatingParticles() {
  return (
    <Sparkles count={200} scale={[12, 8, 5]} size={2} speed={0.4} opacity={0.5} color="#ef4444" position={[0, 0, 1]} />
  )
}

function Rig() {
  const { camera, mouse } = useThree()
  const vec = new THREE.Vector3()

  useFrame(() => {
    // Subtle parallax effect based on mouse position
    camera.position.lerp(vec.set(mouse.x * 0.5, mouse.y * 0.5, camera.position.z), 0.05)
    camera.lookAt(0, 0, 0)
  })
  return null
}

export function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
      <color attach="background" args={["#050505"]} />

      {/* Cinematic Lighting */}
      <ambientLight intensity={0.2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#ef4444" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#3b82f6" />

      <Rig />

      {/* The Robot Background */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
        <Image
          url={ROBOT_IMG}
          scale={[12, 7]} // 16:9 aspect ratio roughly
          position={[0, 0, -2]}
          transparent
          opacity={0.9}
          color="#888" // Slight tint to integrate with scene
        />
      </Float>

      {/* Digital Security Barrier */}
      <Barrier />

      {/* Atmospheric Particles */}
      <FloatingParticles />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Foreground Fog/Glow */}
      <mesh position={[0, -4, 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 10]} />
        <meshBasicMaterial
          color="#ef4444"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  )
}

/**
 * The UI Overlay component.
 * Displays the 403 error message, status details, and action buttons.
 * Uses Framer Motion for entrance animations.
 */

import { motion } from "framer-motion"
import { ArrowLeft, ShieldAlert, Terminal, Unlock } from "lucide-react"

// Custom Button Component
function SciFiButton({
  children,
  variant = "primary",
  icon: Icon,
  onClick,
  className,
}: {
  children: React.ReactNode
  variant?: "primary" | "outline"
  icon?: any
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative px-6 py-3 font-mono text-sm uppercase tracking-widest transition-all duration-300",
        "flex items-center gap-3 overflow-hidden",
        variant === "primary"
          ? "bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30 hover:border-primary"
          : "bg-transparent text-muted-foreground border border-muted-foreground/30 hover:text-white hover:border-white/50",
        className
      )}
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-current opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-current opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current opacity-50 group-hover:opacity-100 transition-opacity" />

      {/* Background scan effect */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

      {Icon && <Icon className="w-4 h-4" />}
      <span className="relative z-10">{children}</span>
    </button>
  )
}

function Overlay() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Side: Main Error Content */}
        <div className="pointer-events-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
              <span className="font-mono text-xs tracking-[0.2em] uppercase">Security Alert: Level 4</span>
            </div>

            <h1 className="text-8xl md:text-9xl font-bold font-['Rajdhani'] text-transparent bg-clip-text bg-linear-to-b from-white to-white/10 leading-[0.8] tracking-tighter">
              403
            </h1>
            <h2 className="text-3xl md:text-4xl font-light text-white uppercase tracking-widest">
              Access <span className="text-red-500 font-bold">Denied</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="border-l-2 border-red-500/30 pl-6 py-2"
          >
            <p className="text-muted-foreground font-mono text-sm md:text-base max-w-md leading-relaxed">
              SECURITY PROTOCOL ATLAS-9 ACTIVE.
              <br />
              YOUR BIOMETRIC SIGNATURE IS NOT RECOGNIZED IN THIS SECTOR. CLEARANCE IS REQUIRED TO PROCEED PAST THE
              NEURAL BARRIER.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <SciFiButton icon={ArrowLeft} onClick={() => console.log("Back")}>
              Return to Safety
            </SciFiButton>
            <SciFiButton variant="outline" icon={Unlock} onClick={() => console.log("Request")}>
              Request Access
            </SciFiButton>
          </motion.div>
        </div>

        {/* Right Side: Decorative Data/Terminal */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="hidden md:block pointer-events-none opacity-50"
        >
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-6 rounded-lg font-mono text-xs text-green-500/80 h-64 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-2 text-white/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p>{`> SYSTEM_CHECK... OK`}</p>
              <p>{`> NEURAL_LINK... STABLE`}</p>
              <p className="text-red-500">{`> AUTH_MODULE... REJECTED`}</p>
              <p>{`> TRACE_ORIGIN... 192.168.0.X`}</p>
              <p>{`> ATTEMPTING RECONNECTION...`}</p>
              {Array.from({ length: 8 }).map((_, i) => (
                <p
                  key={i}
                  className="opacity-50"
                >{`> 0x${Math.random().toString(16).slice(2, 10).toUpperCase()}...`}</p>
              ))}
              <p className="animate-pulse text-red-500 pt-4">{`> LOCKDOWN INITIATED`}</p>
            </div>
            {/* Scanline overlay */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-green-500/5 to-transparent opacity-20 animate-scan pointer-events-none" />
          </div>
        </motion.div>
      </div>

      {/* Footer / Status Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-0 right-0 flex justify-between px-8 text-[10px] font-mono text-white/30 uppercase tracking-widest"
      >
        <span>ID: ATLAS-CORE-8842</span>
        <div className="flex gap-4">
          <span>
            Sys: <span className="text-green-500">Online</span>
          </span>
          <span>
            Sec: <span className="text-red-500">High</span>
          </span>
          <span>Ver: 4.2.0</span>
        </div>
      </motion.div>
    </div>
  )
}

import { cn } from "@devtools/libs"
/**
 * Main AtlasError403 Component
 * Combines the 3D Scene (Background) and the UI Overlay.
 *
 * Features:
 * - Fullscreen 3D Canvas
 * - Responsive UI Overlay
 * - Loading State
 */
import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"

function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black text-red-600 font-mono tracking-widest">
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs animate-pulse">LOADING ATLAS PROTOCOLS...</span>
      </div>
    </div>
  )
}

export function AtlasError403() {
  // We use a key to force re-render on resize if needed, but R3F handles it mostly.
  // This state is mainly to demonstrate we can control the scene props.
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden selection:bg-red-500/30 selection:text-red-200">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<Loader />}>
          <Canvas
            dpr={[1, 2]}
            gl={{
              antialias: true,
              toneMapping: 3, // ACESFilmic
              toneMappingExposure: 1.2,
            }}
          >
            <Scene />
          </Canvas>
        </Suspense>
      </div>

      {/* UI Overlay */}
      <Overlay />

      {/* Decorative Border Overlay */}
      <div className="absolute inset-0 border-[20px] border-white/5 pointer-events-none z-20 rounded-3xl opacity-50 hidden md:block" />
      <div className="absolute top-8 left-8 w-64 h-[1px] bg-linear-to-r from-red-500/50 to-transparent z-20" />
      <div className="absolute bottom-8 right-8 w-64 h-[1px] bg-linear-to-l from-red-500/50 to-transparent z-20" />
    </div>
  )
}

export default AtlasError403
