import { cn } from "@devtools/libs"
import { ContactShadows, Environment, PerspectiveCamera, Stars } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import { RobotModel } from "./Robot3D"

export function RobotCanvas({ className }: { className?: string }) {
  "use memo"
  return (
    <div className={cn("w-full h-full", className)}>
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
        <ambientLight intensity={0.5} color="#4c1d95" />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#00f0ff" castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ff003c" />
        <Suspense fallback={null}>
          <RobotModel scale={0.6} position={[0, -2, 0]} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2.5} far={4} color="#00f0ff" />
          <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/rogland_clear_night_1k.hdr" />
        </Suspense>
        <gridHelper args={[20, 20, 0x1a1a30, 0x0a0a1a]} position={[0, -2.5, 0]} />
      </Canvas>
    </div>
  )
}
