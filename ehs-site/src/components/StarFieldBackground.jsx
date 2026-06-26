import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function StarField({ count = 4000 }) {
  const ref = useRef();

  const [positions, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const radius = 40 + Math.random() * 160;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      sizes[i] = Math.random() * 1.6 + 0.2;
    }
    return [positions, sizes];
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.004;
      ref.current.rotation.x += delta * 0.0008;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.6}
        sizeAttenuation
        color="#e8ecff"
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}

function NebulaGlow() {
  const ref1 = useRef();
  const ref2 = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref1.current) ref1.current.position.set(Math.sin(t * 0.02) * 30, Math.cos(t * 0.015) * 15, -60);
    if (ref2.current) ref2.current.position.set(Math.cos(t * 0.018) * -25, Math.sin(t * 0.022) * 18, -80);
  });

  return (
    <>
      <mesh ref={ref1}>
        <sphereGeometry args={[28, 16, 16]} />
        <meshBasicMaterial color="#5b6fff" transparent opacity={0.045} />
      </mesh>
      <mesh ref={ref2}>
        <sphereGeometry args={[22, 16, 16]} />
        <meshBasicMaterial color="#7d3cff" transparent opacity={0.04} />
      </mesh>
    </>
  );
}

export default function StarFieldBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        background:
          'radial-gradient(ellipse at 50% 0%, #0d1224 0%, #05060a 55%, #05060a 100%)',
      }}
      aria-hidden="true"
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 1.5]}>
        <StarField />
        <NebulaGlow />
      </Canvas>
    </div>
  );
}
