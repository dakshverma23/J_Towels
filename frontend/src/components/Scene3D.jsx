import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Component, Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const PALETTES = {
  home: {
    ocean: "#0b2f6f",
    glow: "#38bdf8",
    line: "#7dd3fc",
    point: "#e0f2fe",
    pulse: "#60a5fa"
  },
  products: {
    ocean: "#0f3b77",
    glow: "#22d3ee",
    line: "#93c5fd",
    point: "#eff6ff",
    pulse: "#38bdf8"
  },
  admin: {
    ocean: "#071a3d",
    glow: "#60a5fa",
    line: "#bfdbfe",
    point: "#ffffff",
    pulse: "#22d3ee"
  },
  default: {
    ocean: "#0b2f6f",
    glow: "#38bdf8",
    line: "#7dd3fc",
    point: "#e0f2fe",
    pulse: "#60a5fa"
  }
};

const HUBS = [
  { name: "Madurai", lat: 9.9252, lon: 78.1198 },
  { name: "London", lat: 51.5072, lon: -0.1276 },
  { name: "New York", lat: 40.7128, lon: -74.006 },
  { name: "Dubai", lat: 25.2048, lon: 55.2708 },
  { name: "Singapore", lat: 1.3521, lon: 103.8198 },
  { name: "Sydney", lat: -33.8688, lon: 151.2093 },
  { name: "Rotterdam", lat: 51.9244, lon: 4.4777 }
];

const EARTH_TEXTURES = {
  map: "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
  bump: "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg",
  specular: "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg",
  clouds: "https://threejs.org/examples/textures/planets/earth_clouds_1024.png"
};

function latLonToVector3(lat, lon, radius = 1.55) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function createWorldMapTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const project = ([lon, lat]) => [((lon + 180) / 360) * canvas.width, ((90 - lat) / 180) * canvas.height];
  const drawLand = (points) => {
    ctx.beginPath();
    points.forEach((point, index) => {
      const [x, y] = project(point);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
  };

  const ocean = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  ocean.addColorStop(0, "#0a3d7c");
  ocean.addColorStop(0.42, "#0d78b6");
  ocean.addColorStop(0.68, "#0b4f92");
  ocean.addColorStop(1, "#061f55");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 120; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = 24 + Math.random() * 86;
    const glow = ctx.createRadialGradient(x, y, 0, x, y, r);
    glow.addColorStop(0, "rgba(125, 211, 252, 0.12)");
    glow.addColorStop(1, "rgba(125, 211, 252, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.shadowColor = "rgba(3, 7, 18, 0.32)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = "rgba(198, 229, 214, 0.9)";

  drawLand([[-168, 72], [-138, 70], [-112, 58], [-96, 50], [-72, 49], [-56, 38], [-82, 25], [-104, 18], [-124, 30], [-144, 48]]);
  drawLand([[-82, 13], [-64, 8], [-48, -8], [-42, -22], [-54, -44], [-69, -55], [-78, -38], [-84, -10]]);
  drawLand([[-52, 78], [-20, 76], [-18, 62], [-44, 58], [-60, 66]]);
  drawLand([[-12, 58], [18, 62], [38, 50], [28, 38], [2, 36], [-10, 44]]);
  drawLand([[-18, 34], [12, 36], [34, 24], [48, 6], [40, -24], [18, -35], [0, -26], [-12, 6]]);
  drawLand([[34, 56], [72, 62], [112, 56], [146, 44], [154, 24], [126, 8], [96, 8], [76, 22], [54, 18], [40, 34]]);
  drawLand([[66, 28], [92, 28], [88, 8], [74, 6]]);
  drawLand([[96, 8], [122, 8], [122, -8], [104, -6]]);
  drawLand([[112, -12], [154, -18], [150, -38], [118, -42], [108, -28]]);

  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
  ctx.lineWidth = 1;
  for (let lon = -150; lon <= 150; lon += 30) {
    const [x] = project([lon, 0]);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const [, y] = project([0, lat]);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function createCloudTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 95; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const w = 80 + Math.random() * 190;
    const h = 16 + Math.random() * 44;
    const opacity = 0.06 + Math.random() * 0.16;
    const cloud = ctx.createRadialGradient(x, y, 0, x, y, w * 0.5);
    cloud.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
    cloud.addColorStop(0.52, `rgba(255, 255, 255, ${opacity * 0.52})`);
    cloud.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = cloud;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, h / w);
    ctx.beginPath();
    ctx.arc(0, 0, w, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function ConnectionArc({ from, to, color, delay = 0 }) {
  const meshRef = useRef(null);
  const pulseRef = useRef(null);

  const { curve, geometry } = useMemo(() => {
    const start = latLonToVector3(from.lat, from.lon);
    const end = latLonToVector3(to.lat, to.lon);
    const mid = start.clone().add(end).normalize().multiplyScalar(2.25);
    const c = new THREE.QuadraticBezierCurve3(start, mid, end);
    return {
      curve: c,
      geometry: new THREE.TubeGeometry(c, 64, 0.008, 8, false)
    };
  }, [from, to]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.opacity = 0.24 + Math.sin(state.clock.elapsedTime * 1.7 + delay) * 0.08;
    }
    if (pulseRef.current) {
      const t = (state.clock.elapsedTime * 0.16 + delay) % 1;
      pulseRef.current.position.copy(curve.getPoint(t));
      const scale = 0.8 + Math.sin(state.clock.elapsedTime * 4 + delay) * 0.18;
      pulseRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry}>
        <meshBasicMaterial color={color} transparent opacity={0.28} />
      </mesh>
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function GlobePoint({ hub, color }) {
  const ref = useRef(null);
  const position = useMemo(() => latLonToVector3(hub.lat, hub.lon, 1.59), [hub]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.scale.setScalar(0.9 + Math.sin(state.clock.elapsedTime * 2.5 + position.x) * 0.18);
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.055, 20, 20]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
    </mesh>
  );
}

function GlobalNetwork({ palette }) {
  const groupRef = useRef(null);
  const cloudRef = useRef(null);
  const madurai = HUBS[0];
  const destinations = HUBS.slice(1);
  const fallbackMapTexture = useMemo(() => createWorldMapTexture(), []);
  const fallbackCloudTexture = useMemo(() => createCloudTexture(), []);
  const [earthMap, earthBump, earthSpecular, earthClouds] = useLoader(THREE.TextureLoader, [
    EARTH_TEXTURES.map,
    EARTH_TEXTURES.bump,
    EARTH_TEXTURES.specular,
    EARTH_TEXTURES.clouds
  ]);

  const mapTexture = earthMap || fallbackMapTexture;
  const cloudTexture = earthClouds || fallbackCloudTexture;

  useMemo(() => {
    [earthMap, earthBump, earthSpecular, earthClouds, fallbackMapTexture, fallbackCloudTexture].forEach((texture) => {
      if (!texture) return;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
    });
  }, [earthMap, earthBump, earthSpecular, earthClouds, fallbackMapTexture, fallbackCloudTexture]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.13;
    groupRef.current.rotation.x = -0.18 + Math.sin(state.clock.elapsedTime * 0.22) * 0.05;
    if (cloudRef.current) cloudRef.current.rotation.y = state.clock.elapsedTime * 0.035;
  });

  return (
    <group ref={groupRef} rotation={[0, -0.5, 0.12]}>
      <mesh>
        <sphereGeometry args={[1.52, 96, 96]} />
        <meshStandardMaterial
          map={mapTexture}
          bumpMap={earthBump}
          bumpScale={0.035}
          roughnessMap={earthSpecular}
          color="#ffffff"
          emissive={palette.glow}
          emissiveIntensity={0.08}
          roughness={0.58}
          metalness={0.08}
        />
      </mesh>
      {cloudTexture && (
        <mesh ref={cloudRef}>
          <sphereGeometry args={[1.56, 96, 96]} />
          <meshStandardMaterial map={cloudTexture} transparent opacity={0.74} depthWrite={false} roughness={0.9} />
        </mesh>
      )}
      <mesh>
        <sphereGeometry args={[1.64, 96, 96]} />
        <meshBasicMaterial color={palette.glow} transparent opacity={0.12} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.7, 96, 96]} />
        <meshBasicMaterial color="#dff7ff" transparent opacity={0.06} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      <mesh position={[-0.45, 0.2, 1.18]}>
        <sphereGeometry args={[0.92, 48, 48]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.08} depthWrite={false} />
      </mesh>
      <mesh position={[0.82, -0.56, 1.05]}>
        <sphereGeometry args={[0.54, 40, 40]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.06} depthWrite={false} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.56, 0.006, 8, 160]} />
        <meshBasicMaterial color={palette.line} transparent opacity={0.36} />
      </mesh>
      <mesh rotation={[0.95, 0.25, 0.2]}>
        <torusGeometry args={[1.72, 0.004, 8, 160]} />
        <meshBasicMaterial color={palette.line} transparent opacity={0.2} />
      </mesh>
      <mesh rotation={[1.3, -0.5, 0.8]}>
        <torusGeometry args={[1.86, 0.004, 8, 160]} />
        <meshBasicMaterial color={palette.glow} transparent opacity={0.16} />
      </mesh>

      {HUBS.map((hub) => (
        <GlobePoint key={hub.name} hub={hub} color={hub.name === "Madurai" ? palette.pulse : palette.point} />
      ))}

      {destinations.map((hub, index) => (
        <ConnectionArc key={hub.name} from={madurai} to={hub} color={palette.line} delay={index * 0.17} />
      ))}
    </group>
  );
}

class SceneBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

function FallbackNetwork({ palette }) {
  return (
    <div className="global-network-fallback" style={{ "--net-a": palette.glow, "--net-b": palette.line }}>
      <span className="net-orbit net-orbit-a" />
      <span className="net-orbit net-orbit-b" />
      <span className="net-orbit net-orbit-c" />
      <span className="net-dot net-dot-a" />
      <span className="net-dot net-dot-b" />
      <span className="net-dot net-dot-c" />
      <span className="net-dot net-dot-d" />
    </div>
  );
}

function hasWebGLSupport() {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

export default function Scene3D({ variant = "default", className = "" }) {
  const palette = PALETTES[variant] || PALETTES.default;
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    setWebglReady(hasWebGLSupport());
  }, []);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {!webglReady ? <FallbackNetwork palette={palette} /> : null}
      {webglReady ? (
      <SceneBoundary fallback={<FallbackNetwork palette={palette} />}>
        <Canvas
          camera={{ position: [0, 0.1, 5.4], fov: 44 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true }}
          className="h-full w-full"
          fallback={<FallbackNetwork palette={palette} />}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.42} />
            <hemisphereLight args={["#e0f2fe", "#082f66", 1.1]} />
            <directionalLight position={[4, 3, 5]} intensity={2.35} color="#ffffff" />
            <directionalLight position={[-4, 2, 3]} intensity={0.9} color={palette.glow} />
            <pointLight position={[-3, -2, 4]} intensity={1.35} color={palette.pulse} />
            <GlobalNetwork palette={palette} />
          </Suspense>
        </Canvas>
      </SceneBoundary>
      ) : null}
    </div>
  );
}
