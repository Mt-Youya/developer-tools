import { Environment, OrbitControls, useGLTF } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import * as THREE from "three"

interface ModelViewerProps {
  modelUrl: string
  autoRotate?: boolean
}

function Model({ url }: { url: string }) {
  "use memo"
  const { scene } = useGLTF(url)
  const modelRef = useRef<THREE.Group>(null)

  // 优化模型
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh

          // 启用阴影
          mesh.castShadow = true
          mesh.receiveShadow = true

          // 优化材质
          if (mesh.material) {
            const material = mesh.material as THREE.MeshStandardMaterial
            material.needsUpdate = true
          }
        }
      })

      // 居中模型
      const box = new THREE.Box3().setFromObject(scene)
      const center = box.getCenter(new THREE.Vector3())
      scene.position.sub(center)
    }
  }, [scene])

  return <primitive ref={modelRef} object={scene} />
}

export function ModelViewer({ modelUrl, autoRotate = true }: ModelViewerProps) {
  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden bg-gray-100">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} shadows gl={{ antialias: true, alpha: true }}>
        <Suspense
          fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="gray" />
            </mesh>
          }
        >
          {/* 光源 */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />

          {/* 模型 */}
          <Model url={modelUrl} />

          {/* 环境 */}
          <Environment preset="studio" />

          {/* 控制器 */}
          <OrbitControls
            autoRotate={autoRotate}
            autoRotateSpeed={2}
            enableDamping
            dampingFactor={0.05}
            minDistance={2}
            maxDistance={10}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

// 预加载模型
useGLTF.preload("/models/default.glb")
