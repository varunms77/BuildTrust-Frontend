import React, { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Procedural Apartment Building under construction.
 * High-fidelity structural skeleton with concrete and steel details.
 */
export default function ApartmentSkeleton({ position = [0, 0, 0], stories = 4 }) {
  const floorHeight = 1.8
  const dimensions = { width: 8, depth: 6 }

  const structuralElements = useMemo(() => {
    const elements = []

    // ── Generate Floors & Columns ──
    for (let i = 0; i < stories; i++) {
      const y = i * floorHeight

      // Floor Slab (Rough Concrete)
      elements.push(
        <mesh key={`floor-${i}`} position={[0, y, 0]}>
          <boxGeometry args={[dimensions.width, 0.15, dimensions.depth]} />
          <meshPhysicalMaterial 
            color="#2a2a2e" 
            roughness={0.9} 
            metalness={0.1}
            clearcoat={0.1}
          />
        </mesh>
      )

      // Columns (Concrete Pillars)
      const columnPositions = [
        [dimensions.width / 2 - 0.2, y + floorHeight / 2, dimensions.depth / 2 - 0.2],
        [-dimensions.width / 2 + 0.2, y + floorHeight / 2, dimensions.depth / 2 - 0.2],
        [dimensions.width / 2 - 0.2, y + floorHeight / 2, -dimensions.depth / 2 + 0.2],
        [-dimensions.width / 2 + 0.2, y + floorHeight / 2, -dimensions.depth / 2 + 0.2],
        [0, y + floorHeight / 2, dimensions.depth / 2 - 0.2],
        [0, y + floorHeight / 2, -dimensions.depth / 2 + 0.2]
      ]

      columnPositions.forEach((pos, j) => {
        elements.push(
          <mesh key={`col-${i}-${j}`} position={pos}>
            <boxGeometry args={[0.3, floorHeight, 0.3]} />
            <meshPhysicalMaterial color="#333338" roughness={0.8} />
          </mesh>
        )
      })

      // ── Exposed Rebar (Small details for high fidelity) ──
      if (i === stories - 1) {
        columnPositions.forEach((pos, j) => {
          for (let k = 0; k < 4; k++) {
            elements.push(
              <mesh 
                key={`rebar-${j}-${k}`} 
                position={[pos[0] + (k < 2 ? 0.08 : -0.08), stories * floorHeight + 0.3, pos[2] + (k % 2 === 0 ? 0.08 : -0.08)]}
              >
                <cylinderGeometry args={[0.015, 0.015, 0.8, 6]} />
                <meshStandardMaterial color="#5a4a3a" metalness={0.8} roughness={0.4} />
              </mesh>
            )
          }
        })
      }
    }

    // ── Elevator Core (Tall central structure) ──
    elements.push(
      <mesh key="core" position={[ -1, (stories * floorHeight) / 2, 0 ]}>
        <boxGeometry args={[2, stories * floorHeight, 2]} />
        <meshPhysicalMaterial color="#1e1e22" roughness={0.9} />
      </mesh>
    )

    return elements
  }, [stories])

  return (
    <group position={position}>
      {structuralElements}
    </group>
  )
}
