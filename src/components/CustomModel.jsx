import React, { useRef } from 'react'
import { useGLTF, Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════
   CUSTOM MODEL LOADER
   Loads a high-quality GLB from a public URL
   ═══════════════════════════════════════════════ */
export default function CustomModel({ url, position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) {
  const { scene } = useGLTF(url)
  const groupRef = useRef()
  const t = useRef(0)

  // Subtle floating and rotation animation
  useFrame((state, delta) => {
    t.current += delta
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2
      groupRef.current.position.y = position[1] + Math.sin(t.current * 0.5) * 0.1
    }
  })

  // Apply high-quality material properties to children
  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true
      if (child.material) {
        child.material.envMapIntensity = 2
        // Optional: override some colors to fit the primary emerald theme
        if (child.name.toLowerCase().includes('glow') || child.name.toLowerCase().includes('light')) {
          child.material.emissive = new THREE.Color('#00e5a0')
          child.material.emissiveIntensity = 2
        }
      }
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <primitive 
        ref={groupRef}
        object={scene} 
        position={position} 
        scale={scale} 
        rotation={rotation}
      />
    </Float>
  )
}

// Preload the model to avoid pop-in
useGLTF.preload('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb')
