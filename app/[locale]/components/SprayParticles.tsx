import * as THREE from 'three';
import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

type SprayParticlesProps = {
  gunRef: React.RefObject<THREE.Object3D | null>;
  sprayActive: boolean;
  sprayColor: THREE.Color | string;
  isMobile: boolean;
};

function SprayParticles({ gunRef, sprayActive, sprayColor, isMobile }: SprayParticlesProps) {
  // Configuration: adjust particle counts and behavior for mobile vs desktop
  const maxParticles = isMobile ? 600 : 1500;  // Maximum particles in system
  const spawnRate = isMobile ? 200 : 500;      // Particles per second emitted when spraying (approx)
  const particleLifetime = 0.7;               // Lifetime of each particle (seconds) before fade-out
  const gravity = new THREE.Vector3(0, -2.0, 0);    // Gravity acceleration (Y-axis downward)
  const dragFactor = 0.98;                          // Air resistance (velocity multiplier per frame)

  // Pre-allocate buffers for particle data 
  const positions = useMemo(() => new Float32Array(maxParticles * 3), [maxParticles]);
  const colors = useMemo(() => new Float32Array(maxParticles * 4), [maxParticles]);  // RGBA (4 components)
  const velocities = useMemo(() => new Float32Array(maxParticles * 3), [maxParticles]);
  const lifetimes = useMemo(() => new Float32Array(maxParticles), [maxParticles]);
  const ages = useMemo(() => new Float32Array(maxParticles), [maxParticles]);

  // Three.js BufferGeometry for points, with position & color attributes
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  if (!geometryRef.current) {
    geometryRef.current = new THREE.BufferGeometry();
    geometryRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometryRef.current.setAttribute('color', new THREE.BufferAttribute(colors, 4));  // using 4 components allows per-particle alpha
    geometryRef.current.setDrawRange(0, 0);
  }

  // Texture for particles: a small radial gradient (white center fading to transparent)
  const particleTexture = useMemo(() => {
    const size = 32;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    // Draw radial gradient circle
    const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }, []);

  // Keep track of active particles count and spawn timing 
  const activeCountRef = useRef(0);
  const spawnAccumulatorRef = useRef(0);

  // Refs to hold current spray state (to avoid stale closures inside useFrame)
  const sprayActiveRef = useRef(sprayActive);
  const currentColorRef = useRef<THREE.Color>(new THREE.Color(sprayColor));
  useEffect(() => { 
    sprayActiveRef.current = sprayActive; 
  }, [sprayActive]);
  useEffect(() => {
    // Update current color (Three.Color) from prop whenever it changes
    if (sprayColor instanceof THREE.Color) {
      currentColorRef.current.copy(sprayColor);
    } else {
      currentColorRef.current.set(sprayColor);
    }
  }, [sprayColor]);

  // Main animation loop: update particle positions, spawn new particles when active
  useFrame((_, delta) => {
    const geometry = geometryRef.current!;
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const colAttr = geometry.attributes.color as THREE.BufferAttribute;
    let count = activeCountRef.current;

    // Emit new particles if spraying is active 
    if (sprayActiveRef.current && gunRef.current) {
      // Calculate how many new particles to spawn this frame (based on spawnRate)
      spawnAccumulatorRef.current += spawnRate * delta;
      const toSpawn = Math.floor(spawnAccumulatorRef.current);
      spawnAccumulatorRef.current -= toSpawn;

      if (toSpawn > 0) {
        // Determine nozzle world position and forward direction (spray direction)
        // Positioned at the very tip of the nozzle that extends toward the text
        const nozzleOffset = new THREE.Vector3(0, 2.35, 0.85);
        const nozzlePos = gunRef.current.localToWorld(nozzleOffset.clone());
        const forwardPos = gunRef.current.localToWorld(nozzleOffset.clone().setZ(nozzleOffset.z + 0.1));
        const baseDir = forwardPos.sub(nozzlePos).normalize();  // base direction from nozzle

        for (let i = 0; i < toSpawn && count < maxParticles; i++) {
          // Initialize new particle at nozzle
          positions[count * 3]     = nozzlePos.x;
          positions[count * 3 + 1] = nozzlePos.y;
          positions[count * 3 + 2] = nozzlePos.z;
          // Assign initial velocity with random spray spread
          const dir = baseDir.clone();
          // small random angular divergence
          dir.x += (Math.random() - 0.5) * 0.2;
          dir.y += (Math.random() - 0.5) * 0.2;
          dir.z += (Math.random() - 0.5) * 0.1;
          dir.normalize();
          const speed = (isMobile ? 2.0 : 2.5) * (0.8 + 0.4 * Math.random());  // vary speed (larger droplets = faster)
          const vel = dir.multiplyScalar(speed);
          velocities[count * 3]     = vel.x;
          velocities[count * 3 + 1] = vel.y;
          velocities[count * 3 + 2] = vel.z;
          // Set particle color (use current spray color) and full alpha=1
          const c = currentColorRef.current;
          colors[count * 4]     = c.r;
          colors[count * 4 + 1] = c.g;
          colors[count * 4 + 2] = c.b;
          colors[count * 4 + 3] = 1.0;
          // Set lifetime and reset age
          lifetimes[count] = particleLifetime;
          ages[count] = 0;
          count++;
        }
      }
    }

    // Update existing particles 
    for (let i = count - 1; i >= 0; i--) {
      // Advance age
      ages[i] += delta;
      // If particle expired, remove it by swapping with the last active particle
      if (ages[i] >= lifetimes[i]) {
        count--;
        if (i < count) {
          // Copy data from last particle into slot i
          positions[i*3]     = positions[count*3];
          positions[i*3 + 1] = positions[count*3 + 1];
          positions[i*3 + 2] = positions[count*3 + 2];
          velocities[i*3]    = velocities[count*3];
          velocities[i*3 + 1]= velocities[count*3 + 1];
          velocities[i*3 + 2]= velocities[count*3 + 2];
          colors[i*4]        = colors[count*4];
          colors[i*4 + 1]    = colors[count*4 + 1];
          colors[i*4 + 2]    = colors[count*4 + 2];
          colors[i*4 + 3]    = colors[count*4 + 3];
          lifetimes[i]       = lifetimes[count];
          ages[i]            = ages[count];
        }
        continue;
      }
      // Apply physics to active particle i:
      // Update velocity with gravity (v = v + g*dt) and air drag
      velocities[i*3]     += gravity.x * delta;
      velocities[i*3 + 1] += gravity.y * delta;
      velocities[i*3 + 2] += gravity.z * delta;
      velocities[i*3]     *= dragFactor;
      velocities[i*3 + 1] *= dragFactor;
      velocities[i*3 + 2] *= dragFactor;
      // Update position (p = p + v*dt)
      positions[i*3]     += velocities[i*3] * delta;
      positions[i*3 + 1] += velocities[i*3 + 1] * delta;
      positions[i*3 + 2] += velocities[i*3 + 2] * delta;
      // Fade out particle by reducing alpha over lifetime
      const lifeFrac = 1 - (ages[i] / lifetimes[i]);
      colors[i*4 + 3] = lifeFrac;  // alpha goes from 1 -> 0
    }

    // Write back updated count and mark attributes as needing update
    activeCountRef.current = count;
    geometry.setDrawRange(0, count);
    if (count > 0) {
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    }
  });

  // Render the particle points in the scene
  return (
    <points ref={undefined} args={[geometryRef.current]} frustumCulled={false}>
      <pointsMaterial 
        map={particleTexture}
        vertexColors={true}
        transparent={true}
        opacity={1.0}
        blending={THREE.NormalBlending}
        depthWrite={false}
        depthTest={true}
        size={isMobile ? 0.03 : 0.04}         // base size of particles (smaller on mobile screens)
        sizeAttenuation={true}               // particles appear smaller in the distance
      />
    </points>
  );
}

export default SprayParticles; 