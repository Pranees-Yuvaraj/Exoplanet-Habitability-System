import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

// Procedural planet surface via shader — avoids needing external texture assets
const planetVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const planetFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform vec3 lightDir;
  uniform float time;

  // simple hash-based noise for continent-like patterning
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }

  void main() {
    float n = noise(vPosition * 2.4) * 0.6 + noise(vPosition * 5.0) * 0.3 + noise(vPosition * 11.0) * 0.1;
    vec3 ocean = vec3(0.03, 0.12, 0.32);
    vec3 land = vec3(0.08, 0.32, 0.28);
    vec3 highland = vec3(0.45, 0.42, 0.32);
    vec3 surface = mix(ocean, land, smoothstep(0.42, 0.52, n));
    surface = mix(surface, highland, smoothstep(0.62, 0.72, n));

    float diff = max(dot(vNormal, normalize(lightDir)), 0.0);
    vec3 lit = surface * (0.12 + diff * 1.3);

    // terminator glow
    float rim = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 3.0);
    vec3 cyanRim = vec3(0.24, 0.94, 1.0) * rim * 0.25 * max(diff, 0.15);

    gl_FragColor = vec4(lit + cyanRim, 1.0);
  }
`;

function Planet({ mouse }) {
  const meshRef = useRef();
  const atmosphereRef = useRef();
  const lightDir = useMemo(() => new THREE.Vector3(3, 1.5, 2), []);

  const uniforms = useMemo(
    () => ({
      lightDir: { value: lightDir },
      time: { value: 0 },
    }),
    [lightDir]
  );

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.06;
      // gentle mouse-reactive tilt
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        mouse.current.y * 0.15,
        0.04
      );
      meshRef.current.rotation.z = THREE.MathUtils.lerp(
        meshRef.current.rotation.z,
        -mouse.current.x * 0.1,
        0.04
      );
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <shaderMaterial
          vertexShader={planetVertexShader}
          fragmentShader={planetFragmentShader}
          uniforms={uniforms}
        />
      </mesh>
      {/* atmosphere glow shell */}
      <mesh ref={atmosphereRef} scale={1.08}>
        <sphereGeometry args={[1.6, 48, 48]} />
        <meshBasicMaterial
          color="#3ef0ff"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>
      <mesh scale={1.18}>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshBasicMaterial
          color="#5b6fff"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

function Satellite({ radius, speed, offset, size, color }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset;
    if (ref.current) {
      ref.current.position.set(Math.cos(t) * radius, Math.sin(t * 0.6) * 0.4, Math.sin(t) * radius);
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function OrbitRing({ radius }) {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 128; i++) {
      const t = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(t) * radius, 0, Math.sin(t) * radius));
    }
    return pts;
  }, [radius]);
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#5b6fff" transparent opacity={0.18} />
    </line>
  );
}

function Scene({ mouse }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 2, 4]} intensity={2.2} color="#fff7e8" />
      <Planet mouse={mouse} />
      <OrbitRing radius={2.6} />
      <OrbitRing radius={3.3} />
      <Satellite radius={2.6} speed={0.35} offset={0} size={0.05} color="#3ef0ff" />
      <Satellite radius={3.3} speed={0.22} offset={2.1} size={0.04} color="#ffd866" />
      <Satellite radius={3.3} speed={0.22} offset={4.6} size={0.04} color="#ffd866" />
      <EffectComposer>
        <Bloom intensity={0.7} luminanceThreshold={0.15} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette eskil={false} offset={0.15} darkness={0.6} />
      </EffectComposer>
    </>
  );
}

export default function HeroPlanet() {
  const mouse = useRef({ x: 0, y: 0 });

  const handlePointerMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    mouse.current = { x, y };
  };

  return (
    <div
      style={{ position: 'absolute', inset: 0 }}
      onPointerMove={handlePointerMove}
      aria-hidden="true"
    >
      <Canvas camera={{ position: [0, 0.4, 5.2], fov: 45 }} dpr={[1, 2]}>
        <Scene mouse={mouse} />
      </Canvas>
    </div>
  );
}
