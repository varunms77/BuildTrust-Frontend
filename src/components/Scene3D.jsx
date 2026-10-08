import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import ApartmentSkeleton from './ApartmentSkeleton'
import MaterialShowcase from './MaterialShowcase'

/* ═══════════════════════════════════════════════
   SCROLL-DRIVEN CAMERA — moves through the 3D world
   ═══════════════════════════════════════════════ */
function ScrollCamera({ scrollProgress }) {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const smoothMouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouse = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  useFrame(() => {
    // Smooth mouse follow
    smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * 0.03
    smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * 0.03

    const t = scrollProgress
    const mx = smoothMouse.current.x
    const my = smoothMouse.current.y

    // Camera path through the 3D world — 5 stops
    let px, py, pz, lx, ly, lz

    if (t < 0.2) {
      // Stop 1: Hero — wide establishing shot
      const s = t / 0.2
      px = 0 + mx * 0.4
      py = 2 + my * -0.2 - s * 0.5
      pz = 12 - s * 2
      lx = 0
      ly = 1
      lz = 0
    } else if (t < 0.4) {
      // Stop 2: Materials — Orbit around the showroom
      const s = (t - 0.2) / 0.2
      const angle = s * Math.PI * 0.3
      px = -4 * Math.cos(angle) + mx * 0.3
      py = 0.8 + my * -0.1
      pz = 5 + Math.sin(angle) * 3
      lx = 2
      ly = 0.5
      lz = 2
    } else if (t < 0.6) {
      // Stop 3: Blockchain — focus on structural integrity (skeleton)
      const s = (t - 0.4) / 0.2
      px = -2 + s * 4 + mx * 0.3
      py = 2 + s * 3 + my * -0.2
      pz = 6 - s * 2
      lx = 0
      ly = 4
      lz = 0
    } else if (t < 0.8) {
      // Stop 4: Dashboard — elevated view
      const s = (t - 0.6) / 0.2
      px = 3 - s * 3 + mx * 0.3
      py = 4 + s * 2 + my * -0.2
      pz = 6 + s * 3
      lx = 0
      ly = 1
      lz = 0
    } else {
      // Stop 5: CTA — dramatic close
      const s = (t - 0.8) / 0.2
      px = 0 + mx * 0.5
      py = 1 + s * 1.5 + my * -0.3
      pz = 9 + s * 2
      lx = 0
      ly = 2
      lz = 0
    }

    camera.position.lerp(new THREE.Vector3(px, py, pz), 0.04)
    const lookTarget = new THREE.Vector3(lx, ly, lz)
    const currentLook = new THREE.Vector3()
    camera.getWorldDirection(currentLook)
    camera.lookAt(lookTarget)
  })

  return null
}

/* ═══════════════════════════════════════════════
   FUTURISTIC CONSTRUCTION COMPLEX
   ═══════════════════════════════════════════════ */
function ConstructionComplex() {
  const groupRef = useRef()
  const t = useRef(0)

  useFrame((_, delta) => {
    t.current += delta
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t.current * 0.05) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* ── Main Apartment Under Construction ── */}
      <ApartmentSkeleton position={[0, 0, 0]} stories={5} />

      {/* ── Material Market/Showroom (Ground Focus) ── */}
      <MaterialShowcase position={[2, 0, 2]} />

      {/* ── Secondary Structures ── */}
      <ApartmentSkeleton position={[-10, 0, -5]} stories={2} />

      {/* ── Construction Crane ── */}
      <CraneModel />

      {/* ── Ground Platform (Industrial Finish) ── */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[30, 0.1, 30]} />
        <meshPhysicalMaterial
          color="#121215"
          metalness={0.9}
          roughness={0.1}
          clearcoat={0.5}
        />
      </mesh>

      {/* Grid lines on ground */}
      {[...Array(17)].map((_, i) => (
        <mesh key={`gx-${i}`} position={[-8 + i, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.008, 12]} />
          <meshBasicMaterial color="#00e5a0" transparent opacity={0.04} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {[...Array(13)].map((_, i) => (
        <mesh key={`gz-${i}`} position={[0, 0.01, -6 + i]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[0.008, 16]} />
          <meshBasicMaterial color="#00e5a0" transparent opacity={0.04} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Small accent structures */}
      <mesh position={[4, 0.25, 2]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshPhysicalMaterial color="#0c1428" metalness={0.8} roughness={0.2} transparent opacity={0.7} />
      </mesh>
      <mesh position={[-1.5, 0.2, 3]}>
        <cylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
        <meshPhysicalMaterial color="#0e1530" metalness={0.8} roughness={0.2} transparent opacity={0.6} />
      </mesh>
      <mesh position={[5, 0.15, -1]}>
        <boxGeometry args={[0.6, 0.3, 0.4]} />
        <meshPhysicalMaterial color="#0a0f1e" metalness={0.8} roughness={0.2} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

/* ── Animated Crane ── */
function CraneModel() {
  const hookRef = useRef()
  const t = useRef(0)

  useFrame((_, delta) => {
    t.current += delta
    if (hookRef.current) {
      hookRef.current.position.y = -0.3 + Math.sin(t.current * 0.8) * 0.4
    }
  })

  return (
    <group position={[3, 0, 2]}>
      {/* Mast */}
      <mesh position={[0, 3.5, 0]}>
        <boxGeometry args={[0.15, 7, 0.15]} />
        <meshStandardMaterial color="#eab308" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Cross braces */}
      {[...Array(7)].map((_, i) => (
        <group key={`cb-${i}`}>
          <mesh position={[0, 0.5 + i * 1, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.02, 0.5, 0.02]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      ))}
      {/* Horizontal boom */}
      <mesh position={[2, 7, 0]}>
        <boxGeometry args={[5, 0.1, 0.1]} />
        <meshStandardMaterial color="#eab308" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Counter-jib */}
      <mesh position={[-1, 7, 0]}>
        <boxGeometry args={[1.5, 0.1, 0.1]} />
        <meshStandardMaterial color="#eab308" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Counter weight */}
      <mesh position={[-1.6, 6.8, 0]}>
        <boxGeometry args={[0.35, 0.3, 0.3]} />
        <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Support cables */}
      <mesh position={[0, 7.6, 0]}>
        <coneGeometry args={[0.02, 1.2, 4]} />
        <meshStandardMaterial color="#999" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Hook cable + load */}
      <group ref={hookRef} position={[3.5, 4, 0]}>
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 3, 6]} />
          <meshStandardMaterial color="#aaa" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.5, 0.35, 0.5]} />
          <meshStandardMaterial
            color="#00e5a0"
            emissive="#00e5a0"
            emissiveIntensity={0.7}
            transparent
            opacity={0.85}
          />
        </mesh>
      </group>
    </group>
  )
}

/* ═══════════════════════════════════════════════
   ORBITING RINGS — blockchain symbol
   ═══════════════════════════════════════════════ */
function OrbitalRings() {
  const ring1 = useRef()
  const ring2 = useRef()
  const ring3 = useRef()
  const t = useRef(0)

  useFrame((_, delta) => {
    t.current += delta
    if (ring1.current) {
      ring1.current.rotation.z = t.current * 0.15
      ring1.current.rotation.x = Math.PI / 3
    }
    if (ring2.current) {
      ring2.current.rotation.z = -t.current * 0.12
      ring2.current.rotation.x = Math.PI / 2.5
      ring2.current.rotation.y = Math.PI / 4
    }
    if (ring3.current) {
      ring3.current.rotation.z = t.current * 0.1
      ring3.current.rotation.x = Math.PI / 5
      ring3.current.rotation.y = -Math.PI / 3
    }
  })

  return (
    <group position={[0, 4, 0]}>
      <mesh ref={ring1}>
        <torusGeometry args={[5, 0.015, 16, 120]} />
        <meshStandardMaterial color="#00e5a0" emissive="#00e5a0" emissiveIntensity={0.4} transparent opacity={0.2} />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[6, 0.01, 16, 120]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.3} transparent opacity={0.12} />
      </mesh>
      <mesh ref={ring3}>
        <torusGeometry args={[7, 0.008, 16, 100]} />
        <meshStandardMaterial color="#00b4d8" emissive="#00b4d8" emissiveIntensity={0.2} transparent opacity={0.08} />
      </mesh>
    </group>
  )
}

/* ═══════════════════════════════════════════════
   ATMOSPHERE PARTICLES
   ═══════════════════════════════════════════════ */
function AtmosphereParticles({ count = 400 }) {
  const meshRef = useRef()
  const t = useRef(0)

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      pos: [
        (Math.random() - 0.5) * 30,
        Math.random() * 20 - 2,
        (Math.random() - 0.5) * 24,
      ],
      speed: 0.1 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
      scale: 0.006 + Math.random() * 0.02,
    }))
  }, [count])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((_, delta) => {
    t.current += delta
    if (!meshRef.current) return
    particles.forEach((p, i) => {
      const time = t.current * p.speed + p.offset
      dummy.position.set(
        p.pos[0] + Math.sin(time * 0.3) * 0.8,
        p.pos[1] + Math.cos(time * 0.2) * 0.4 + Math.sin(time * 0.1) * 0.2,
        p.pos[2] + Math.sin(time * 0.15) * 0.6,
      )
      dummy.scale.setScalar(p.scale * (1 + Math.sin(time * 1.5) * 0.3))
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#00e5a0" transparent opacity={0.45} />
    </instancedMesh>
  )
}

/* ═══════════════════════════════════════════════
   FLOATING CHAIN BLOCKS
   ═══════════════════════════════════════════════ */
function ChainBlocks() {
  const items = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      pos: [
        (Math.random() - 0.5) * 20,
        Math.random() * 14 - 1,
        (Math.random() - 0.5) * 16,
      ],
      scale: 0.05 + Math.random() * 0.15,
      speed: 0.15 + Math.random() * 0.4,
      color: ['#00e5a0', '#8b5cf6', '#00b4d8', '#ec4899'][Math.floor(Math.random() * 4)],
    })), [])

  return (
    <>
      {items.map((item, i) => (
        <ChainBlock key={i} {...item} />
      ))}
    </>
  )
}

function ChainBlock({ pos, scale, speed, color }) {
  const ref = useRef()
  const t = useRef(Math.random() * 100)

  useFrame((_, delta) => {
    t.current += delta * speed
    if (ref.current) {
      ref.current.rotation.x = t.current * 0.5
      ref.current.rotation.y = t.current * 0.3
      ref.current.position.y = pos[1] + Math.sin(t.current) * 0.5
    }
  })

  return (
    <mesh ref={ref} position={pos} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        transparent
        opacity={0.15}
        wireframe
      />
    </mesh>
  )
}

/* ═══════════════════════════════════════════════
   MAIN SCENE EXPORT
   ═══════════════════════════════════════════════ */
export default function Scene3D({ scrollProgress = 0 }) {
  return (
    <Canvas
      camera={{ position: [0, 2, 12], fov: 50 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      dpr={[1, 1.5]}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#050508']} />

      {/* Cinematic Lighting — Boosted for visibility */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} color="#ffffff" castShadow />
      <pointLight position={[-5, 8, 4]} intensity={2} color="#00e5a0" distance={30} />
      <pointLight position={[6, 4, -4]} intensity={1.5} color="#8b5cf6" distance={25} />
      <pointLight position={[0, -2, 10]} intensity={1} color="#00b4d8" distance={20} />
      <spotLight position={[0, 20, 0]} angle={0.4} penumbra={1} intensity={2} color="#00e5a0" />
      <directionalLight position={[-4, 5, -8]} intensity={0.2} color="#8b5cf6" />

      {/* Scroll-driven camera */}
      <ScrollCamera scrollProgress={scrollProgress} />

      {/* High-end rendering environment */}
      <Environment preset="city" />
      <ContactShadows 
        position={[0, -0.01, 0]} 
        opacity={0.4} 
        blur={2} 
        scale={20} 
        far={10} 
        resolution={256} 
        color="#000000" 
      />

      {/* World */}
      <ConstructionComplex />
      <OrbitalRings />
      <AtmosphereParticles count={350} />
      <ChainBlocks />

      {/* Fog */}
      <fog attach="fog" args={['#050508', 8, 30]} />
    </Canvas>
  )
}
