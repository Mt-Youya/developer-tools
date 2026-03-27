import { Float, useAnimations, useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import React, { useEffect, useRef, useState } from "react"
import * as THREE from "three"

// Preload the model to avoid pop-in
const MODEL_URL =
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/models/gltf/RobotExpressive/RobotExpressive.glb"
try {
  useGLTF.preload(MODEL_URL)
} catch (e) {
  console.warn("Failed to preload model:", e)
}

export function RobotModel(props: any) {
  "use memo"
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(MODEL_URL)
  const { actions, names } = useAnimations(animations, group)

  // Interaction states
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  // Initialize animations
  useEffect(() => {
    // Default to Idle
    const action = actions["Idle"]
    if (action) {
      action.reset().fadeIn(0.5).play()
    }
    return () => {
      action?.fadeOut(0.5)
    }
  }, [actions])

  // Handle interactions
  function handlePointerOver() {
    setHover(true)
    document.body.style.cursor = "pointer"
  }

  function handlePointerOut() {
    setHover(false)
    document.body.style.cursor = "auto"
  }

  function handleClick() {
    setActive(!active)

    // Pick a random fun animation
    const funAnimations = ["Dance", "Jump", "Wave", "Yes", "ThumbsUp"]
    const nextAnim = funAnimations[Math.floor(Math.random() * funAnimations.length)]

    // Switch animation
    if (actions[nextAnim] && actions["Idle"]) {
      actions["Idle"].fadeOut(0.2)
      const newAction = actions[nextAnim].reset().fadeIn(0.2).play()
      newAction.clampWhenFinished = true
      newAction.loop = THREE.LoopOnce

      // Return to Idle after it finishes
      const duration = newAction.getClip().duration * 1000
      setTimeout(() => {
        newAction.fadeOut(0.5)
        actions["Idle"]?.reset().fadeIn(0.5).play()
      }, duration)
    }
  }

  // Animation Loop for Look-at behavior
  useFrame((state) => {
    if (!group.current) return

    // Smoothly rotate the whole robot to face the cursor slightly
    const targetX = state.pointer.y * 0.2 // Look up/down (inverted/scaled)
    const targetY = state.pointer.x * 0.4 // Look left/right

    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.1)
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.1)

    // Add a little extra breathing scale on hover
    const targetScale = hovered ? 1.1 : 1
    group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
  })

  return (
    <group {...props}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
        <group
          ref={group}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          dispose={null}
        >
          <primitive object={scene} />
        </group>
      </Float>

      {/* Dynamic Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  )
}
