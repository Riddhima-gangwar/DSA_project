import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

function Helicopter() {
  const groupRef = useRef<THREE.Group>(null);
  const bladesRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime * 0.4;
      groupRef.current.position.x = Math.cos(t) * 3;
      groupRef.current.position.z = Math.sin(t) * 3;
      groupRef.current.position.y = Math.sin(t * 2) * 1;
      
      groupRef.current.lookAt(
        Math.cos(t + 0.1) * 3,
        Math.sin((t + 0.1) * 2) * 1,
        Math.sin(t + 0.1) * 3
      );
    }
    if (bladesRef.current) {
      bladesRef.current.rotation.y += delta * 15;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.2, 0.6, 8, 16]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.5} wireframe />
      </mesh>
      <mesh position={[0, 0, -0.6]}>
        <boxGeometry args={[0.05, 0.2, 0.6]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} wireframe />
      </mesh>
      <mesh ref={bladesRef} position={[0, 0.25, 0]}>
        <boxGeometry args={[1.2, 0.02, 0.05]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>
    </group>
  );
}

function FloatingParticles() {
  const count = 100;
  const dummy = new THREE.Object3D();
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);

  const particlesData = React.useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      x: (Math.random() - 0.5) * 10,
      y: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 10,
      speed: Math.random() * 0.2 + 0.1,
    }));
  }, [count]);

  useFrame((state, delta) => {
    if (instancedMeshRef.current) {
      particlesData.forEach((particle, i) => {
        particle.y += particle.speed * delta;
        if (particle.y > 5) particle.y = -5;
        
        dummy.position.set(particle.x, particle.y, particle.z);
        dummy.updateMatrix();
        instancedMeshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={instancedMeshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial color="#0ea5e9" transparent opacity={0.6} />
    </instancedMesh>
  );
}

export default function Hero3DScene() {
  const earthRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.2;
      ringRef.current.rotation.y -= delta * 0.1;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <Sphere ref={earthRef} args={[2, 64, 64]}>
        <meshStandardMaterial 
          color="#020617" 
          emissive="#0ea5e9"
          emissiveIntensity={0.2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>

      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.8, 0.01, 16, 100]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.6} />
      </mesh>

      <Helicopter />

      {/* Floating Crates */}
      {[0, 1, 2].map((i) => {
        const x = Math.sin(i * Math.PI * 0.6) * 3;
        const y = Math.cos(i * Math.PI * 0.8) * 2;
        const z = Math.sin(i * Math.PI) * 2;
        
        return (
          <Float key={i} speed={2} rotationIntensity={1} floatIntensity={1} position={[x, y, z]}>
             <mesh>
              <boxGeometry args={[0.3, 0.3, 0.3]} />
              <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} wireframe />
            </mesh>
          </Float>
        );
      })}

      <FloatingParticles />
    </group>
  );
}

// Simple Float component since we aren't importing from drei directly if not needed, wait we can just use frame
function Float({ children, speed, position }: any) {
  const ref = useRef<THREE.Group>(null);
  const offset = Math.random() * 10000;
  
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime + offset;
      ref.current.position.y = position[1] + Math.sin(t * speed) * 0.2;
      ref.current.rotation.x = Math.sin(t * speed * 0.5) * 0.2;
      ref.current.rotation.y = Math.cos(t * speed * 0.5) * 0.2;
    }
  });

  return <group ref={ref} position={position}>{children}</group>;
}
