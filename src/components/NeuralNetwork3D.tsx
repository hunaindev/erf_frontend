import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PresentationControls } from "@react-three/drei";
import * as THREE from "three";

const NODE_COUNT_DESKTOP = 90;
const NODE_COUNT_MOBILE = 36;
const PROXIMITY = 3.5;
const DRIFT_SPEED = 0.05;
const SPREAD = 8;

type CanvasErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

type CanvasErrorBoundaryState = {
  hasError: boolean;
};

function canCreateWebGLContext(): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  try {
    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");

    if (!context) {
      return false;
    }

    context.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

class CanvasErrorBoundary extends Component<
  CanvasErrorBoundaryProps,
  CanvasErrorBoundaryState
> {
  state: CanvasErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): CanvasErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    if (import.meta.env.DEV) {
      console.warn("Neural network background disabled because WebGL could not start.", error);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function NeuralNetworkFallback() {
  return <div className="pointer-events-none absolute inset-0 z-0 bg-[#0B0118]" aria-hidden="true" />;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return isMobile;
}

function generateNodes(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    arr[i * 3] = (Math.random() - 0.5) * SPREAD * 2;
    arr[i * 3 + 1] = (Math.random() - 0.5) * SPREAD * 2;
    arr[i * 3 + 2] = (Math.random() - 0.5) * SPREAD * 1.2;
  }
  return arr;
}

function generateVelocities(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    arr[i * 3] = (Math.random() - 0.5) * 0.3;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
  }
  return arr;
}

function Nodes({ count }: { count: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const positions = useRef(generateNodes(count));
  const velocities = useRef(generateVelocities(count));
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const sizes = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) s[i] = 0.06 + Math.random() * 0.1;
    return s;
  }, [count]);

  useFrame((_, delta) => {
    const pos = positions.current;
    const vel = velocities.current;
    const clampedDelta = Math.min(delta, 0.1);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      vel[i3] += (Math.random() - 0.5) * 0.02;
      vel[i3 + 1] += (Math.random() - 0.5) * 0.02;
      vel[i3 + 2] += (Math.random() - 0.5) * 0.01;

      vel[i3] *= 0.98;
      vel[i3 + 1] *= 0.98;
      vel[i3 + 2] *= 0.98;

      pos[i3] += vel[i3] * DRIFT_SPEED * clampedDelta * 60;
      pos[i3 + 1] += vel[i3 + 1] * DRIFT_SPEED * clampedDelta * 60;
      pos[i3 + 2] += vel[i3 + 2] * DRIFT_SPEED * clampedDelta * 60;

      for (let j = 0; j < 3; j++) {
        const bound = j === 2 ? SPREAD * 0.6 : SPREAD;
        if (Math.abs(pos[i3 + j]) > bound) vel[i3 + j] *= -0.5;
      }

      dummy.position.set(pos[i3], pos[i3 + 1], pos[i3 + 2]);
      dummy.scale.setScalar(sizes[i]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshPhysicalMaterial
        transmission={0.8}
        roughness={0.2}
        thickness={1}
        emissive={new THREE.Color("#9D4EDD")}
        emissiveIntensity={0.8}
        color="#9D4EDD"
        transparent
        opacity={0.7}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

function Bağlanions({ nodeCount }: { nodeCount: number }) {
  const linesRef = useRef<THREE.LineSegments>(null!);

  const maxBağlanions = nodeCount * 6;
  const maxParticles = Math.floor(maxBağlanions / 2);

  const linePositions = useMemo(() => new Float32Array(maxBağlanions * 6), [maxBağlanions]);
  const lineGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    g.setDrawRange(0, 0);
    return g;
  }, [linePositions]);

  const particlePositions = useMemo(() => new Float32Array(maxParticles * 3), [maxParticles]);
  const particleGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    g.setDrawRange(0, 0);
    return g;
  }, [particlePositions]);

  const particleState = useRef<{ from: number; to: number; t: number; speed: number }[]>([]);

  useFrame(() => {
    const scene = linesRef.current?.parent;
    if (!scene) return;

    const instancedMesh = scene.children.find(
      (c) => (c as THREE.InstancedMesh).isInstancedMesh,
    ) as THREE.InstancedMesh | undefined;

    if (!instancedMesh) return;

    const mat = new THREE.Matrix4();
    const posA = new THREE.Vector3();
    const posB = new THREE.Vector3();

    let lineIdx = 0;
    let pIdx = 0;
    const connections: [number, number][] = [];

    for (let i = 0; i < nodeCount && lineIdx < maxBağlanions; i++) {
      instancedMesh.getMatrixAt(i, mat);
      posA.setFromMatrixPosition(mat);

      for (let j = i + 1; j < nodeCount && lineIdx < maxBağlanions; j++) {
        instancedMesh.getMatrixAt(j, mat);
        posB.setFromMatrixPosition(mat);

        const dist = posA.distanceTo(posB);
        if (dist < PROXIMITY) {
          const idx = lineIdx * 6;
          linePositions[idx] = posA.x;
          linePositions[idx + 1] = posA.y;
          linePositions[idx + 2] = posA.z;
          linePositions[idx + 3] = posB.x;
          linePositions[idx + 4] = posB.y;
          linePositions[idx + 5] = posB.z;
          connections.push([i, j]);
          lineIdx++;
        }
      }
    }

    lineGeom.attributes.position.needsUpdate = true;
    lineGeom.setDrawRange(0, lineIdx * 2);

    const states = particleState.current;
    while (states.length < Math.min(connections.length, maxParticles)) {
      const ci = states.length % connections.length;
      states.push({
        from: connections[ci][0],
        to: connections[ci][1],
        t: Math.random(),
        speed: 0.003 + Math.random() * 0.008,
      });
    }

    for (let i = 0; i < Math.min(states.length, maxParticles, connections.length); i++) {
      const s = states[i];
      s.t += s.speed;

      if (s.t > 1) {
        s.t = 0;
        const ci = Math.floor(Math.random() * connections.length);
        s.from = connections[ci][0];
        s.to = connections[ci][1];
        s.speed = 0.003 + Math.random() * 0.008;
      }

      instancedMesh.getMatrixAt(s.from, mat);
      posA.setFromMatrixPosition(mat);
      instancedMesh.getMatrixAt(s.to, mat);
      posB.setFromMatrixPosition(mat);

      const idx = pIdx * 3;
      particlePositions[idx] = posA.x + (posB.x - posA.x) * s.t;
      particlePositions[idx + 1] = posA.y + (posB.y - posA.y) * s.t;
      particlePositions[idx + 2] = posA.z + (posB.z - posA.z) * s.t;
      pIdx++;
    }

    particleGeom.attributes.position.needsUpdate = true;
    particleGeom.setDrawRange(0, pIdx);
  });

  return (
    <>
      <lineSegments ref={linesRef} geometry={lineGeom}>
        <lineBasicMaterial color="#9D4EDD" transparent opacity={0.15} toneMapped={false} />
      </lineSegments>
      <points geometry={particleGeom}>
        <pointsMaterial
          color="#ffffff"
          size={0.06}
          transparent
          opacity={0.9}
          toneMapped={false}
          sizeAttenuation
        />
      </points>
    </>
  );
}

function Background() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uColor1: { value: new THREE.Color("#0B0118") },
          uColor2: { value: new THREE.Color("#1A0B3A") },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          varying vec2 vUv;
          void main() {
            float d = distance(vUv, vec2(0.5));
            gl_FragColor = vec4(mix(uColor1, uColor2, d * 1.8), 1.0);
          }
        `,
        depthWrite: false,
      }),
    [],
  );

  return (
    <mesh position={[0, 0, -12]} material={mat}>
      <planeGeometry args={[40, 40]} />
    </mesh>
  );
}

function Scene() {
  const isMobile = useIsMobile();
  const count = isMobile ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP;

  return (
    <PresentationControls
      global
      rotation={[0, 0, 0]}
      polar={[-0.15, 0.15]}
      azimuth={[-0.3, 0.3]}
      config={{ mass: 2, tension: 400 }}
      snap={{ mass: 4, tension: 300 }}
    >
      <Float speed={0.6} rotationIntensity={0.1} floatIntensity={0.3}>
        <Background />
        <Nodes count={count} />
        <Bağlanions nodeCount={count} />
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#9D4EDD" />
        <pointLight position={[-5, -3, 3]} intensity={0.3} color="#FF006E" />
      </Float>
    </PresentationControls>
  );
}

export default function NeuralNetwork3D() {
  const [canUseWebGL, setCanUseWebGL] = useState(canCreateWebGLContext);

  useEffect(() => {
    setCanUseWebGL(canCreateWebGLContext());
  }, []);

  if (!canUseWebGL) {
    return <NeuralNetworkFallback />;
  }

  return (
    <CanvasErrorBoundary fallback={<NeuralNetworkFallback />}>
      <div className="pointer-events-none absolute inset-0 z-0">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 10], fov: 55 }}
          gl={{ antialias: true, alpha: false }}
          style={{ background: "#0B0118" }}
        >
          <Scene />
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
}
