import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Earth = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group position={[3, 0, -5]}>
      {/* Reduced geometry complexity from 64x64 to 32x32 */}
      <Sphere ref={meshRef} args={[2.5, 32, 32]}>
        <MeshDistortMaterial 
          color="#0ea5e9" 
          envMapIntensity={1} 
          clearcoat={0.5} 
          clearcoatRoughness={0.2} 
          metalness={0.5} 
          roughness={0.3}
          distort={0.1}
          speed={1.5}
        />
      </Sphere>
    </group>
  );
};

export default function EarthCanvas() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-auto">
      {/* Added dpr limitation to improve framerate on high DPI screens */}
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#0ea5e9" />
        <Earth />
      </Canvas>
    </div>
  );
}
