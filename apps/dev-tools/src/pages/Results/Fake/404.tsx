import { ContactShadows, Environment, Float, PerspectiveCamera, RoundedBox, Sparkles, Stars } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { motion } from "framer-motion"
import { AlertCircle, ArrowLeft, RefreshCw, Terminal } from "lucide-react"
import type { Group } from "three"

function RobotHead() {
  const group = useRef<Group>(null)
  const [hovered, setHover] = useState(false)

  // Subtle head tracking or idle animation
  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.getElapsedTime()
    group.current.rotation.y = Math.sin(t * 0.5) * 0.1
    group.current.rotation.z = Math.sin(t * 0.3) * 0.05
  })

  return (
    <group ref={group} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
      <RoundedBox args={[1.2, 0.9, 1.1]} radius={0.15} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} envMapIntensity={1} />
      </RoundedBox>

      <RoundedBox args={[0.9, 0.6, 0.1]} radius={0.05} position={[0, 0, 0.52]}>
        <meshStandardMaterial color="#0f172a" metalness={1} roughness={0} />
      </RoundedBox>

      <mesh position={[0, 0.05, 0.53]}>
        <capsuleGeometry args={[0.02, 0.6, 4, 8]} />
        <meshBasicMaterial color="#0ea5e9" toneMapped={false} />
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[0.6, 0.04]} />
          <meshBasicMaterial color="#0ea5e9" transparent opacity={0.5} toneMapped={false} />
        </mesh>
      </mesh>

      <RoundedBox args={[0.15, 0.4, 0.4]} radius={0.02} position={[0.65, 0, 0]}>
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[0.15, 0.4, 0.4]} radius={0.02} position={[-0.65, 0, 0]}>
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </RoundedBox>

      <group position={[0, 0.5, 0]}>
        <mesh position={[0.2, 0, -0.2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.2]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[-0.2, 0, -0.2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.2]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      </group>
    </group>
  )
}

function RobotBody() {
  return (
    <group position={[0, -1.2, 0]}>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.4]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
      </mesh>

      <RoundedBox args={[1.4, 1.2, 0.8]} radius={0.2} position={[0, -0.2, 0]}>
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </RoundedBox>

      <mesh position={[0, 0, 0.41]}>
        <circleGeometry args={[0.15, 32]} />
        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.8} toneMapped={false} />
      </mesh>

      <mesh position={[0.8, 0.2, 0]}>
        <sphereGeometry args={[0.35]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-0.8, 0.2, 0]}>
        <sphereGeometry args={[0.35]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  )
}

function FloatingFragments() {
  const count = 30
  const fragments = new Array(count).fill(0).map(() => ({
    position: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 6] as [
      number,
      number,
      number,
    ],
    scale: Math.random() * 0.2 + 0.05,
    rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
  }))

  return (
    <group>
      {fragments.map((frag, i) => (
        <Float key={i} speed={2} rotationIntensity={2} floatIntensity={2}>
          <mesh position={frag.position} rotation={frag.rotation} scale={frag.scale}>
            <octahedronGeometry />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0ea5e9"
              emissiveIntensity={0.5}
              transparent
              opacity={0.4}
              wireframe={Math.random() > 0.5}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
      {/* <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/rogland_clear_night_1k.hdr" /> */}
      <ambientLight intensity={0.2} color="#0f172a" />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#38bdf8" />
      <pointLight position={[-5, -5, -5]} intensity={1} color="#ef4444" />

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.2, 0.2]}>
        <group rotation={[0, -0.3, 0]}>
          <RobotHead />
          <RobotBody />
        </group>
      </Float>

      <FloatingFragments />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={50} scale={8} size={2} speed={0.4} opacity={0.5} color="#0ea5e9" />

      <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#000000" />
    </>
  )
}

export default function AtlasErrorPage() {
  return (
    <div className="relative w-full flex-1  bg-[#020617] overflow-hidden flex flex-col font-sans text-slate-100">
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Scene />
        </Canvas>
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay"></div>
      <div className="absolute inset-0 z-10 pointer-events-none opacity-10 bg-[linear-gradient(rgba(14,165,233,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <main className="relative z-20 flex flex-col items-start justify-center h-full max-w-7xl mx-auto px-8 w-full">
        <header className="absolute top-0 left-0 w-full p-8 flex justify-between items-center text-xs tracking-[0.2em] text-cyan-500/60 uppercase">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            {/** biome-ignore lint/suspicious/noCommentText: <explanation> */}
            <span>Atlas Core // System Monitor</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span>Connection Lost</span>
            </div>
            <span>ERR_CODE: 404_NODE_MISSING</span>
          </div>
        </header>

        <div className="max-w-xl backdrop-blur-sm bg-slate-900/40 border border-slate-700/50 p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500 rounded-tl-md"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500 rounded-br-md"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-2 text-cyan-400">
              <AlertCircle className="w-5 h-5" />
              <span className="uppercase tracking-widest text-sm font-bold">Signal Lost</span>
            </div>

            <h1 className="text-8xl font-black text-transparent bg-clip-text bg-linear-to-r from-white to-slate-400 font-['Rajdhani'] leading-none tracking-tighter mb-4">
              404
            </h1>

            <p className="text-2xl font-light text-slate-300 mb-2 font-['Rajdhani']">
              This data node no longer exists.
            </p>

            <p className="text-slate-400 mb-8 leading-relaxed max-w-md">
              The sector you are trying to access has been decoupled from the mainframe or never existed. ATLAS units
              have ceased scanning this coordinate.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                className="group relative px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold tracking-wide rounded transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
                onClick={() => window.history.back()}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Sector Zero</span>
              </button>

              <button
                type="button"
                className="px-6 py-3 bg-transparent border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white rounded transition-all duration-300 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                <span>Diagnostics</span>
              </button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-8 text-[10px] text-slate-600 font-mono space-y-1">
          <p>MEM_ADDR: 0x8472910F</p>
          <p>RENDER_ENGINE: R3F_CORE_V2</p>
          <p>UPTIME: NULL</p>
        </div>
      </main>
    </div>
  )
}
