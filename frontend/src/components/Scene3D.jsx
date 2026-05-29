import { Float, MeshDistortMaterial, Sphere, Torus, Box } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";

const ACCENTS = {
  home: "#d4a574",
  products: "#7eb8da",
  about: "#c9a0dc",
  facilities: "#6ee7b7",
  quality: "#fbbf24",
  careers: "#f472b6",
  contact: "#38bdf8",
  cart: "#d4a574",
  auth: "#a78bfa",
  admin: "#94a3b8",
  default: "#d4a574"
};

function FloatingShapes({ accent }) {
  const group = useRef();
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.08;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
        <Sphere args={[1.2, 64, 64]} position={[-2.5, 0.5, -2]}>
          <MeshDistortMaterial color={accent} attach="material" distort={0.35} speed={2} roughness={0.2} metalness={0.8} />
        </Sphere>
      </Float>
      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={0.8}>
        <Torus args={[1.4, 0.35, 32, 100]} position={[2.8, -0.3, -1.5]} rotation={[0.6, 0.2, 0]}>
          <meshStandardMaterial color={accent} metalness={0.9} roughness={0.15} emissive={accent} emissiveIntensity={0.15} />
        </Torus>
      </Float>
      <Float speed={2.5} rotationIntensity={1} floatIntensity={1.5}>
        <Box args={[1.1, 1.1, 1.1]} position={[0.5, 1.8, -3]} rotation={[0.4, 0.7, 0.2]}>
          <meshStandardMaterial color="#f5ebe0" wireframe />
        </Box>
      </Float>
      <Float speed={1.8} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[0.45, 32, 32]} position={[3.2, 1.5, -2.5]}>
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.4} />
        </Sphere>
      </Float>
    </group>
  );
}

export default function Scene3D({ variant = "default", className = "" }) {
  const accent = ACCENTS[variant] || ACCENTS.default;

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
        <Suspense fallback={null}>
          <color attach="background" args={["#0a0a12"]} />
          <ambientLight intensity={0.35} />
          <pointLight position={[10, 10, 10]} intensity={1.2} color={accent} />
          <pointLight position={[-10, -5, 5]} intensity={0.6} color="#f5ebe0" />
          <FloatingShapes accent={accent} />
        </Suspense>
      </Canvas>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${accent}22 0%, transparent 55%), linear-gradient(180deg, transparent 0%, #0a0a12 85%)`
        }}
      />
    </div>
  );
}
