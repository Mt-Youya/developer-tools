import { cn } from "@devtools/libs"
import { Alert, AlertDescription } from "@devtools/ui"
import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { RefreshCw } from "lucide-react"
import { Suspense } from "react"
import { type Group, Mesh, type PointLight } from "three"

function RobotCore() {
  const groupRef = useRef<Group>(null)
  const emergencyLightRef = useRef<PointLight>(null)
  const glitchTime = useRef(0)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // 紧急灯光闪烁效果
    if (emergencyLightRef.current) {
      const flicker = Math.sin(t * 8) * 0.5 + 0.5
      emergencyLightRef.current.intensity = 2 + flicker * 1.5
    }

    // 轻微的系统不稳定抖动
    if (groupRef.current) {
      glitchTime.current += 0.016
      const glitch = Math.sin(glitchTime.current * 3) * 0.002
      groupRef.current.rotation.y = glitch
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.02
    }
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.2} envMapIntensity={1.5} />
      </mesh>

      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#ff3366"
          emissive="#ff3366"
          emissiveIntensity={0.6}
          transparent
          opacity={0.4}
          metalness={0.1}
          roughness={0.3}
        />
      </mesh>

      {/* 外部装甲环 - 顶部 */}
      <mesh position={[0, 0.8, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[1.4, 0.15, 16, 32]} />
        <meshStandardMaterial color="#2a2a3e" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* 外部装甲环 - 中部 */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.12, 16, 32]} />
        <meshStandardMaterial color="#2a2a3e" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* 外部装甲环 - 底部 */}
      <mesh position={[0, -0.8, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[1.4, 0.15, 16, 32]} />
        <meshStandardMaterial color="#2a2a3e" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* 连接支架 - 4个方向 */}
      {[0, 90, 180, 270].map((angle, i) => (
        <group key={i} rotation={[0, (angle * Math.PI) / 180, 0]}>
          <mesh position={[1.6, 0, 0]}>
            <boxGeometry args={[0.3, 2, 0.15]} />
            <meshStandardMaterial color="#3a3a4e" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* 支架上的警告灯 */}
          <mesh position={[1.6, 0.8, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#ff3366" emissive="#ff3366" emissiveIntensity={2} />
          </mesh>

          <pointLight position={[1.6, 0.8, 0]} color="#ff3366" intensity={1} distance={3} />
        </group>
      ))}

      {/* 顶部天线结构 */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.2, 16]} />
        <meshStandardMaterial color="#4a4a5e" metalness={0.9} roughness={0.2} />
      </mesh>

      <mesh position={[0, 2.5, 0]}>
        <coneGeometry args={[0.15, 0.3, 16]} />
        <meshStandardMaterial color="#ff3366" emissive="#ff3366" emissiveIntensity={1.5} />
      </mesh>

      {/* 底部稳定器 */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.8, 1.2, 0.3, 32]} />
        <meshStandardMaterial color="#2a2a3e" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* 主紧急照明 */}
      <pointLight ref={emergencyLightRef} position={[0, 0, 0]} color="#ff3366" intensity={2} distance={8} />
    </group>
  )
}

function DataFragments() {
  const fragmentsRef = useRef<Group>(null)
  const [fragments] = useState(() => {
    const arr: Array<{
      position: [number, number, number]
      rotation: [number, number, number]
      scale: number
      speed: number
    }> = []
    for (let i = 0; i < 30; i++) {
      arr.push({
        position: [(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 8],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: 0.1 + Math.random() * 0.2,
        speed: 0.2 + Math.random() * 0.3,
      })
    }
    return arr
  })

  useFrame((state) => {
    if (fragmentsRef.current) {
      fragmentsRef.current.children.forEach((child, i) => {
        const fragment = fragments[i]
        if (child instanceof Mesh) {
          child.rotation.x += 0.01 * fragment.speed
          child.rotation.y += 0.015 * fragment.speed

          // 轻微的位置偏移故障效果
          const t = state.clock.getElapsedTime()
          child.position.x = fragment.position[0] + Math.sin(t * fragment.speed) * 0.1
          child.position.y = fragment.position[1] + Math.cos(t * fragment.speed * 0.8) * 0.1
        }
      })
    }
  })

  return (
    <group ref={fragmentsRef}>
      {fragments.map((fragment, i) => (
        <mesh key={i} position={fragment.position} rotation={fragment.rotation} scale={fragment.scale}>
          <boxGeometry args={[1, 0.05, 1]} />
          <meshStandardMaterial
            color="#3366ff"
            emissive="#3366ff"
            emissiveIntensity={0.4}
            transparent
            opacity={0.6}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 6]} fov={50} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate
        autoRotateSpeed={0.5}
      />

      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />
      <directionalLight position={[-5, 3, -5]} intensity={0.3} color="#6666ff" />
      <RobotCore />
      <DataFragments />
      <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/rogland_clear_night_1k.hdr" />
      <fog attach="fog" args={["#0a0a0f", 5, 20]} />
    </>
  )
}

export default function Atlas500Error() {
  const [glitchEffect, setGlitchEffect] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchEffect(true)
      setTimeout(() => setGlitchEffect(false), 100)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const [logs, setLogs] = useState<string[]>([
    "> SYSTEM CRITICAL FAILURE DETECTED",
    "> ERROR CODE: 500",
    "> INITIATING RECOVERY PROTOCOL...",
  ])

  const [isRebooting, setIsRebooting] = useState(false)

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
    <div className="relative w-full h-screen bg-[#0a0a0f] overflow-hidden">
      <div className="absolute inset-0">
        <Canvas>
          <Suspense fallback={<>Loading...</>}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="w-full max-w-2xl px-8 pointer-events-auto">
          <div className="text-center mb-8">
            <h1
              className={`text-9xl font-bold text-transparent bg-clip-text bg-linear-to-r from-red-500 via-red-400 to-red-600 mb-4 transition-all duration-100 ${
                glitchEffect ? "translate-x-1 blur-[2px]" : ""
              }`}
              style={{
                textShadow: glitchEffect ? "2px 0 #ff0000, -2px 0 #00ffff" : "none",
                fontFamily: "monospace",
                letterSpacing: "0.1em",
              }}
            >
              500
            </h1>

            <h2 className="text-2xl font-semibold text-red-400 mb-2 tracking-wide">INTERNAL SYSTEM FAILURE</h2>

            <p className="text-gray-400 text-lg">ATLAS Core suffers internal failure.</p>
          </div>

          <Alert className="mb-8 bg-red-950/30 border-red-900/50 backdrop-blur-sm">
            <AlertDescription className="text-red-300">
              {/* 系统核心组件不稳定。数据结构发生错位或碎片化。所有非关键进程已暂停。 */}
              Something went wrong on our end. Unit 734 is currently attempting to fix the hyper-drive. Please remain
              calm.
            </AlertDescription>
          </Alert>

          <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500 mb-1">SYSTEM STATUS</div>
                <div className="text-red-400 font-mono flex items-center">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                  CRITICAL ERROR
                </div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">ERROR CODE</div>
                <div className="text-gray-300 font-mono">ATLAS-500-CORE</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">TIMESTAMP</div>
                <div className="text-gray-300 font-mono">{new Date().toISOString().split(".")[0]}Z</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">ERROR LEVEL</div>
                <div className="text-orange-400 font-mono">LEVEL 3</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleReboot}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105  flex items-center justify-center gap-2"
            >
              <RefreshCw className={cn("w-4 h-4", isRebooting && "animate-spin")} />
              <span>{isRebooting ? "REBOOTING..." : "REBOOT SYSTEM"}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-4 px-6 rounded-lg transition-all duration-200 border border-gray-700"
            >
              RETURN HOME
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-gray-600 font-mono">
            ATLAS CORE SYSTEM v4.2.1 | EMERGENCY PROTOCOL ACTIVE
          </div>
        </div>
      </div>

      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
        }}
      />
    </div>
  )
}
