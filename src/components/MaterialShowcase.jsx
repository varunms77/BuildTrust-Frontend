import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Material Showcase Component.
 * Displays high-fidelity construction items: Bricks, Steel Rebar, Cement, Timber.
 */
export default function MaterialShowcase({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* ── Bricks Showcase ── */}
      <BrickStack position={[-4, 0, 0]} count={120} />

      {/* ── Steel Rebar Showcase ── */}
      <SteelBundle position={[-1, 0, 3]} count={12} />

      {/* ── Cement/Coating Bags ── */}
      <CementPallet position={[4, 0, 1]} count={15} />

      {/* ── Timber/Lumber ── */}
      <TimberStack position={[3, 0, -3]} />
    </group>
  )
}

/* ── Bricks (Instanced) ── */
function BrickStack({ position, count }) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useMemo(() => {
    // Generate stack positions
    const rows = 5
    const layers = 6
    const cols = Math.ceil(count / (rows * layers))
    
    setTimeout(() => {
      if (!meshRef.current) return
      let index = 0
      for (let l = 0; l < layers; l++) {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (index >= count) break
            dummy.position.set(c * 0.22, l * 0.12, r * 0.12)
            dummy.updateMatrix()
            meshRef.current.setMatrixAt(index++, dummy.matrix)
          }
        }
      }
      meshRef.current.instanceMatrix.needsUpdate = true
    }, 0)
  }, [count, dummy])

  return (
    <group position={position}>
      <instancedMesh ref={meshRef} args={[null, null, count]}>
        <boxGeometry args={[0.2, 0.1, 0.1]} />
        <meshPhysicalMaterial 
          color="#b55c4d" 
          roughness={0.95} 
          metalness={0.05} 
          emissive="#b55c4d"
          emissiveIntensity={0.02}
        />
      </instancedMesh>
      {/* Hover ID Label */}
      <mesh position={[0.5, 0.8, 0.2]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#00e5a0" emissive="#00e5a0" emissiveIntensity={2} />
      </mesh>
    </group>
  )
}

/* ── Steel Rebar (Bundles) ── */
function SteelBundle({ position, count }) {
  return (
    <group position={position} rotation={[0, -Math.PI / 6, 0]}>
      {[...Array(count)].map((_, i) => (
        <mesh 
          key={i} 
          position={[Math.sin(i) * 0.1, Math.cos(i) * 0.1, 0]} 
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.025, 0.025, 4, 8]} />
          <meshPhysicalMaterial 
            color="#4a4a50" 
            metalness={0.95} 
            roughness={0.2} 
            emissive="#00b4d8"
            emissiveIntensity={0.05}
          />
        </mesh>
      ))}
      {/* Holographic Verification Ring */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.25, 0.01, 16, 100]} />
        <meshStandardMaterial color="#00b4d8" emissive="#00b4d8" emissiveIntensity={1} transparent opacity={0.4} />
      </mesh>
    </group>
  )
}

/* ── Cement Bags ── */
function CementPallet({ position, count }) {
  return (
    <group position={position}>
      {/* Wooden Pallet */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.2, 0.1, 1.2]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>
      {/* Bags */}
      {[...Array(count)].map((_, i) => {
        const layer = Math.floor(i / 3)
        const row = i % 3
        return (
          <mesh key={i} position={[row * 0.35 - 0.35, 0.15 + layer * 0.2, 0]}>
            <boxGeometry args={[0.3, 0.18, 0.5]} />
            <meshPhysicalMaterial 
              color="#e0e0e0" 
              roughness={0.9} 
              transparent 
              opacity={0.95}
              clearcoat={0.1}
            />
          </mesh>
        )
      })}
    </group>
  )
}

/* ── Timber Stack ── */
function TimberStack({ position }) {
  return (
    <group position={position} rotation={[0, Math.PI / 8, 0]}>
      {[...Array(20)].map((_, i) => (
        <mesh key={i} position={[0, i * 0.06, (i % 2) * 0.1]}>
          <boxGeometry args={[3, 0.05, 0.2]} />
          <meshPhysicalMaterial color="#c4a484" roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}
