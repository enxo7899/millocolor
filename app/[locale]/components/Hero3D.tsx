"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { Text, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import { useRef, useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import * as THREE from 'three';
import gsap from 'gsap';

// Simple particle system
function SprayParticles({ isActive, gunRef, targetPosition, color }: {
  isActive: boolean; 
  gunRef: React.RefObject<THREE.Object3D | null>;
  targetPosition: THREE.Vector3;
  color: string;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const PARTICLE_COUNT = 120;
  
  const positions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
  const velocities = useMemo(() => 
    Array.from({ length: PARTICLE_COUNT }, () => new THREE.Vector3()), []);
  const lifes = useMemo(() => new Float32Array(PARTICLE_COUNT).fill(0), []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  const material = useMemo(() => new THREE.PointsMaterial({
    color: color,
    size: 0.08,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [color]);

  useFrame((_, delta) => {
    if (!pointsRef.current || !gunRef.current) return;

    // Emit new particles when spraying
    if (isActive) {
      for (let i = 0; i < 15; i++) { // Increased from 8 for denser, more visible spray
        const deadIndex = lifes.findIndex(life => life <= 0);
        if (deadIndex === -1) break;

        lifes[deadIndex] = 0.4 + Math.random() * 0.3; // Increased lifetime for better visibility

        // --- Nozzle emission logic ---
        // Get gun and text world positions
        const gunWorldPos = new THREE.Vector3();
        gunRef.current.getWorldPosition(gunWorldPos);
        const textWorldPos = targetPosition.clone(); // already in world space
        // Interpolate between gun and text (e.g., 30% from gun to text)
        const emissionPos = gunWorldPos.clone().lerp(textWorldPos, 0.05);
        emissionPos.y = targetPosition.y - 0.2; // just under the middle of the title
        positions[deadIndex * 3] = emissionPos.x;
        positions[deadIndex * 3 + 1] = emissionPos.y;
        positions[deadIndex * 3 + 2] = emissionPos.z;

        // Conical spray
        const coneAngle = Math.PI / 10;
        const direction = new THREE.Vector3().subVectors(targetPosition, emissionPos).normalize();
        const axis = new THREE.Vector3(0, 1, 0);
        const spreadAngle = (Math.random() - 0.5) * coneAngle;
        const spreadAxis = new THREE.Vector3().crossVectors(direction, axis).normalize();
        const spreadQuat = new THREE.Quaternion().setFromAxisAngle(spreadAxis, spreadAngle);
        const sprayDir = direction.clone().applyQuaternion(spreadQuat);
        velocities[deadIndex].copy(sprayDir.multiplyScalar(0.7 + Math.random() * 0.3));
      }
    }

    // Update existing particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      if (lifes[i] > 0) {
        lifes[i] -= delta;
        positions[i * 3] += velocities[i].x * delta;
        positions[i * 3 + 1] += velocities[i].y * delta;
        positions[i * 3 + 2] += velocities[i].z * delta;
      }
    }

    geometry.attributes.position.needsUpdate = true;
  });
  
  useEffect(() => {
    if (!isActive) {
      lifes.fill(0);
      // Move all particles far offscreen
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        positions[i * 3] = 9999;
        positions[i * 3 + 1] = 9999;
        positions[i * 3 + 2] = 9999;
      }
    }
  }, [isActive]);

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

// Main scene component
function Scene() {
  const { scene: sprayGun } = useGLTF('/models/spray_gun.glb');
  
  const gunRef = useRef<THREE.Object3D>(null);
  const milloTextRef = useRef<THREE.Mesh>(null);
  const colorTextRef = useRef<THREE.Mesh>(null);
  
  // Animation state
  const [isSpraying, setIsSpraying] = useState(false);
  const [sprayColor, setSprayColor] = useState('#1e3a8a');
  const [targetPosition, setTargetPosition] = useState(new THREE.Vector3(-1.5, 0, 0));
  
  // Text color refs
  const milloColor = useRef(new THREE.Color('#CCCCCC'));
  const colorTextColor = useRef(new THREE.Color('#CCCCCC'));

  // Animation timeline
  useEffect(() => {
    if (!gunRef.current || !milloTextRef.current || !colorTextRef.current) return;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
    const gun = gunRef.current;
    const milloMat = milloTextRef.current.material as THREE.MeshStandardMaterial;
    const colorMat = colorTextRef.current.material as THREE.MeshStandardMaterial;

    // Start position
    gun.position.set(-4, -1.0, 1.5);
    gun.rotation.set(0, 0, -Math.PI/12);

    // Enter and approach Millo
    tl.to(gun.position, { 
      x: -3, 
      y: -1.0,
      duration: 2, 
      ease: "power2.out" 
    }, 0);
    
    // Rotate to face Millo (90 degrees left)
    tl.to(gun.rotation, {
      y: -Math.PI/2,
      duration: 1,
      ease: "power2.out"
    }, 2);

    // Paint Millo - Start spraying exactly over the word
    tl.to(gun.position, { 
      x: -2.5, 
      y: -1.0,
      duration: 0.5, 
      ease: "power2.inOut",
      onStart: () => {
        setIsSpraying(true);
        setSprayColor('#25408F');
        setTargetPosition(new THREE.Vector3(-1.5, 0, 0));
      }
    }, 3);

    // Add slight y-axis rotation during Millo painting (realistic hand movement)
    tl.to(gun.rotation, {
      y: -Math.PI/2 - 0.1,
      duration: 0.5,
      ease: "power2.inOut"
    }, 3.3);

    tl.to(gun.rotation, {
      y: -Math.PI/2 + 0.1,
      duration: 0.5,
      ease: "power2.inOut"
    }, 3.8);

    tl.to(gun.rotation, {
      y: -Math.PI/2 - 0.05,
      duration: 0.5,
      ease: "power2.inOut"
    }, 4.3);

    tl.to(gun.rotation, {
      y: -Math.PI/2 + 0.05,
      duration: 0.5,
      ease: "power2.inOut"
    }, 4.8);

    tl.to(gun.rotation, {
      y: -Math.PI/2,
      duration: 0.5,
      ease: "power2.inOut"
    }, 5.3);

    // First pass: Left to right across full Millo word (faster, more precise)
    tl.to(gun.position, { 
      x: -0.8, 
      y: -1.0,
      duration: 0.8, 
      ease: "power2.inOut"
    }, 3.5);
    
    // Second pass: Right to left across full Millo word (faster, more precise)
    tl.to(gun.position, { 
      x: -2.2, 
      y: -1.0,
      duration: 0.8, 
      ease: "power2.inOut"
    }, 4.3);

    // Third pass: Left to right across full Millo word (faster, more precise)
    tl.to(gun.position, { 
      x: -0.8, 
      y: -1.0,
      duration: 0.8, 
      ease: "power2.inOut"
    }, 5.1);

    // Fourth pass: Right to left across full Millo word (faster, more precise)
    tl.to(gun.position, { 
      x: -2.2, 
      y: -1.0,
      duration: 0.8, 
      ease: "power2.inOut"
    }, 5.9);

    // Fifth pass: Left to right across full Millo word (final fast pass)
    tl.to(gun.position, { 
      x: -0.8, 
      y: -1.0,
      duration: 0.8, 
      ease: "power2.inOut",
      onComplete: () => setIsSpraying(false)
    }, 6.7);

    // Paint Millo blue (darker and bolder)
    tl.to(milloColor.current, {
      r: 0.145, g: 0.251, b: 0.561,
      duration: 7,
      ease: "power1.inOut",
      onUpdate: () => {
        if (milloMat) milloMat.color.copy(milloColor.current);
      }
    }, 3);

    // Move to Color (smooth transition)
    tl.to(gun.position, { 
      x: 1.5, 
      y: -1.0,
      duration: 3,
      ease: "power2.inOut"
    }, 8.5);

    // Keep same rotation (90 degrees left) for Color
    tl.to(gun.rotation, {
      y: -Math.PI/2,
      duration: 1,
      ease: "power2.inOut"
    }, 10.5);

    // Paint Color - Start spraying exactly over the word
    tl.to(gun.position, { 
      x: 0.5, 
      y: -1.0,
      duration: 0.5, 
      ease: "power2.inOut",
      onStart: () => {
        setIsSpraying(true);
        setSprayColor('#E62D2B');
        setTargetPosition(new THREE.Vector3(1.5, 0, 0));
      }
    }, 11.5);

    // Add slight y-axis rotation during Color painting (realistic hand movement)
    tl.to(gun.rotation, {
      y: -Math.PI/2 - 0.1,
      duration: 0.5,
      ease: "power2.inOut"
    }, 11.8);

    tl.to(gun.rotation, {
      y: -Math.PI/2 + 0.1,
      duration: 0.5,
      ease: "power2.inOut"
    }, 12.3);

    tl.to(gun.rotation, {
      y: -Math.PI/2 - 0.05,
      duration: 0.5,
      ease: "power2.inOut"
    }, 12.8);

    tl.to(gun.rotation, {
      y: -Math.PI/2 + 0.05,
      duration: 0.5,
      ease: "power2.inOut"
    }, 13.3);

    tl.to(gun.rotation, {
      y: -Math.PI/2,
      duration: 0.5,
      ease: "power2.inOut"
    }, 13.8);

    // First pass: Left to right across full Color word (faster, more precise)
    tl.to(gun.position, { 
      x: 2.2, 
      y: -1.0,
      duration: 0.8, 
      ease: "power2.inOut"
    }, 12.0);

    // Second pass: Right to left across full Color word (faster, more precise)
    tl.to(gun.position, { 
      x: 0.8, 
      y: -1.0,
      duration: 0.8, 
      ease: "power2.inOut"
    }, 12.8);

    // Third pass: Left to right across full Color word (faster, more precise)
    tl.to(gun.position, { 
      x: 2.2, 
      y: -1.0,
      duration: 0.8, 
      ease: "power2.inOut"
    }, 13.6);

    // Fourth pass: Right to left across full Color word (faster, more precise)
    tl.to(gun.position, { 
      x: 0.8, 
      y: -1.0,
      duration: 0.8, 
      ease: "power2.inOut"
    }, 14.4);

    // Fifth pass: Left to right across full Color word (final fast pass)
    tl.to(gun.position, { 
      x: 2.2, 
      y: -1.0,
      duration: 0.8, 
      ease: "power2.inOut",
      onComplete: () => setIsSpraying(false)
    }, 15.2);

    // Paint Color red
    tl.to(colorTextColor.current, {
      r: 0.902, g: 0.176, b: 0.169,
      duration: 7,
      ease: "power1.inOut",
      onUpdate: () => {
        if (colorMat) colorMat.color.copy(colorTextColor.current);
      }
    }, 11.5);

    // Exit (smooth transition)
    tl.to(gun.position, { 
      x: 4, 
      y: -1.0,
      duration: 3,
      ease: "power2.inOut"
    }, 17.0);

    // Reset colors properly
    tl.to(milloColor.current, {
      r: 0.8, g: 0.8, b: 0.8,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => {
        if (milloMat) milloMat.color.copy(milloColor.current);
      }
    }, 20.0);

    tl.to(colorTextColor.current, {
      r: 0.8, g: 0.8, b: 0.8,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => {
        if (colorMat) colorMat.color.copy(colorTextColor.current);
      }
    }, 20.0);

    return () => {
      tl.kill();
    };
  }, []);

  // Wobble during spraying (more realistic)
  useFrame(() => {
    if (gunRef.current && isSpraying) {
      const time = performance.now() * 0.001;
      const wobble = Math.sin(time * 8) * 0.003;
      const microWobble = Math.sin(time * 15) * 0.001;
      gunRef.current.position.y += wobble + microWobble;
    }
  });

  // Setup spray gun model
  useEffect(() => {
    if (sprayGun) {
      sprayGun.traverse((child: any) => {
        if (child.isMesh) {
          child.material = child.material.clone();
          child.material.metalness = 0.8;
          child.material.roughness = 0.2;
        }
      });
    }
  }, [sprayGun]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <Environment preset="city" />
      
      {/* Text elements */}
        <Text
          ref={milloTextRef}
          position={[-1.5, 0, 0]}
          fontSize={1.0}
          color="#CCCCCC"
          anchorX="center"
          anchorY="middle"
        >
          Millo
        </Text>
        
        <Text
          ref={colorTextRef}
          position={[1.5, 0, 0]}
          fontSize={1.0}
          color="#CCCCCC"
          anchorX="center"
          anchorY="middle"
        >
          Color
        </Text>
        
        {/* Slogan */}
        <Text
          position={[0, -1.2, 0]}
          fontSize={0.35}
          color="#666666"
          anchorX="center"
          anchorY="middle"
        >
          Spray Like a Champion
        </Text>
        
      {/* Spray Gun */}
        <primitive 
        ref={gunRef}
        object={sprayGun}
        scale={[0.35, 0.35, 0.35]}
      />
      
      {/* Particles */}
        <SprayParticles 
          isActive={isSpraying}
        gunRef={gunRef}
          targetPosition={targetPosition}
          color={sprayColor}
        />
    </>
  );
}

// Main Hero3D component
export default function Hero3D() {
  const t = useTranslations('hero');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="relative h-[80vh] sm:h-[85vh] md:h-[90vh] bg-white flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-millo-blue">Millo</span>
            <span className="text-millo-red">Color</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600">Loading 3D Scene...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[80vh] sm:h-[85vh] md:h-[90vh] bg-white overflow-hidden">
      <Canvas 
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        camera={{ position: [0, 0, 6], fov: 45 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#FFFFFF', 0);
        }}
        className="w-full h-full"
      >
        <Scene />
      </Canvas>
      
      {/* CTA Button */}
      <div className="absolute bottom-6 sm:bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 z-10">
        <Link 
          href="/products" 
          className="inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-base sm:text-lg font-medium tracking-wider text-white rounded-md bg-millo-red hover:bg-red-700 transition-colors duration-300 ease-out shadow-lg"
        >
          {t('cta')}
        </Link>
      </div>
    </section>
  );
}
