"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { Text, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import { useRef, useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import * as THREE from 'three';
import gsap from 'gsap';

// Enhanced particle system with better visibility
function SprayParticles({ isActive, gunRef, targetPosition, color }: {
  isActive: boolean; 
  gunRef: React.RefObject<THREE.Object3D | null>;
  targetPosition: THREE.Vector3;
  color: string;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const PARTICLE_COUNT = 200; // Increased for better visibility
  
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
    size: 0.15, // Increased size for better visibility
    transparent: true,
    opacity: 1.0, // Full opacity
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  }), [color]);

  useFrame((_, delta) => {
    if (!pointsRef.current || !gunRef.current) return;

    // Emit new particles when spraying
    if (isActive) {
      for (let i = 0; i < 25; i++) { // Increased emission rate
        const deadIndex = lifes.findIndex(life => life <= 0);
        if (deadIndex === -1) break;

        lifes[deadIndex] = 0.8 + Math.random() * 0.4; // Longer lifetime

        // Get gun world position
        const gunWorldPos = new THREE.Vector3();
        gunRef.current.getWorldPosition(gunWorldPos);
        
        // Emission position - closer to gun nozzle
        const emissionPos = gunWorldPos.clone();
        emissionPos.y += 0.1; // Slightly above gun
        emissionPos.z += 0.2; // Slightly forward
        
        positions[deadIndex * 3] = emissionPos.x;
        positions[deadIndex * 3 + 1] = emissionPos.y;
        positions[deadIndex * 3 + 2] = emissionPos.z;

        // Direction towards target with spread
        const direction = new THREE.Vector3().subVectors(targetPosition, emissionPos).normalize();
        const spreadAngle = (Math.random() - 0.5) * 0.3; // Reduced spread for more focused spray
        const spreadAxis = new THREE.Vector3().crossVectors(direction, new THREE.Vector3(0, 1, 0)).normalize();
        const spreadQuat = new THREE.Quaternion().setFromAxisAngle(spreadAxis, spreadAngle);
        const sprayDir = direction.clone().applyQuaternion(spreadQuat);
        
        // Faster particle velocity
        velocities[deadIndex].copy(sprayDir.multiplyScalar(1.2 + Math.random() * 0.8));
      }
    }

    // Update existing particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      if (lifes[i] > 0) {
        lifes[i] -= delta;
        
        // Add gravity effect
        velocities[i].y -= 0.5 * delta;
        
        positions[i * 3] += velocities[i].x * delta;
        positions[i * 3 + 1] += velocities[i].y * delta;
        positions[i * 3 + 2] += velocities[i].z * delta;
        
        // Fade out as particles age
        const lifeRatio = lifes[i] / 1.2;
        if (lifeRatio < 0.3) {
          positions[i * 3] = 9999; // Move offscreen when fading
        }
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

// Main scene component with simplified animations
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

  // Simplified animation timeline
  useEffect(() => {
    if (!gunRef.current || !milloTextRef.current || !colorTextRef.current) return;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
    const gun = gunRef.current;
    const milloMat = milloTextRef.current.material as THREE.MeshStandardMaterial;
    const colorMat = colorTextRef.current.material as THREE.MeshStandardMaterial;

    // Start position
    gun.position.set(-4, -1.0, 1.5);
    gun.rotation.set(0, 0, -Math.PI/12);

    // Enter and approach Millo
    tl.to(gun.position, { 
      x: -2.8, 
      y: -1.0,
      duration: 2, 
      ease: "power2.out" 
    }, 0);
    
    // Rotate to face Millo
    tl.to(gun.rotation, {
      y: -Math.PI/2,
      duration: 1.5,
      ease: "power2.out"
    }, 1);

    // Paint Millo - Start spraying
    tl.to(gun.position, { 
      x: -2.2, 
      y: -1.0,
      duration: 0.5, 
      ease: "power2.inOut",
      onStart: () => {
        setIsSpraying(true);
        setSprayColor('#25408F');
        setTargetPosition(new THREE.Vector3(-1.5, 0, 0));
      }
    }, 3);

    // Paint Millo - Left to right
    tl.to(gun.position, { 
      x: -0.8, 
      y: -1.0,
      duration: 1.2, 
      ease: "power2.inOut"
    }, 3.5);

    // Paint Millo - Right to left
    tl.to(gun.position, { 
      x: -2.2, 
      y: -1.0,
      duration: 1.2, 
      ease: "power2.inOut",
      onComplete: () => setIsSpraying(false)
    }, 4.7);

    // Paint Millo blue
    tl.to(milloColor.current, {
      r: 0.145, g: 0.251, b: 0.561,
      duration: 2,
      ease: "power1.inOut",
      onUpdate: () => {
        if (milloMat) milloMat.color.copy(milloColor.current);
      }
    }, 3);

    // Move to Color
    tl.to(gun.position, { 
      x: 1.8, 
      y: -1.0,
      duration: 2.5,
      ease: "power2.inOut"
    }, 6.5);

    // Paint Color - Start spraying
    tl.to(gun.position, { 
      x: 1.2, 
      y: -1.0,
      duration: 0.5, 
      ease: "power2.inOut",
      onStart: () => {
        setIsSpraying(true);
        setSprayColor('#E62D2B');
        setTargetPosition(new THREE.Vector3(1.5, 0, 0));
      }
    }, 9.5);

    // Paint Color - Left to right
    tl.to(gun.position, { 
      x: 2.2, 
      y: -1.0,
      duration: 1.2, 
      ease: "power2.inOut"
    }, 10.0);

    // Paint Color - Right to left
    tl.to(gun.position, { 
      x: 0.8, 
      y: -1.0,
      duration: 1.2, 
      ease: "power2.inOut",
      onComplete: () => setIsSpraying(false)
    }, 11.2);

    // Paint Color red
    tl.to(colorTextColor.current, {
      r: 0.902, g: 0.176, b: 0.169,
      duration: 2,
      ease: "power1.inOut",
      onUpdate: () => {
        if (colorMat) colorMat.color.copy(colorTextColor.current);
      }
    }, 9.5);

    // Exit
    tl.to(gun.position, { 
      x: 4, 
      y: -1.0,
      duration: 2.5,
      ease: "power2.inOut"
    }, 13.0);

    // Reset colors
    tl.to(milloColor.current, {
      r: 0.8, g: 0.8, b: 0.8,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => {
        if (milloMat) milloMat.color.copy(milloColor.current);
      }
    }, 16.0);

    tl.to(colorTextColor.current, {
      r: 0.8, g: 0.8, b: 0.8,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => {
        if (colorMat) colorMat.color.copy(colorTextColor.current);
      }
    }, 16.0);

    return () => {
      tl.kill();
    };
  }, []);

  // Subtle wobble during spraying
  useFrame(() => {
    if (gunRef.current && isSpraying) {
      const time = performance.now() * 0.001;
      const wobble = Math.sin(time * 6) * 0.002;
      gunRef.current.position.y += wobble;
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
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <Environment preset="city" />
      
      {/* Text elements */}
      <Text
        ref={milloTextRef}
        position={[-1.5, 0, 0]}
        fontSize={0.8}
        color="#CCCCCC"
        anchorX="center"
        anchorY="middle"
      >
        Millo
      </Text>
      
      <Text
        ref={colorTextRef}
        position={[1.5, 0, 0]}
        fontSize={0.8}
        color="#CCCCCC"
        anchorX="center"
        anchorY="middle"
      >
        Color
      </Text>
      
      {/* Slogan */}
      <Text
        position={[0, -1.0, 0]}
        fontSize={0.25}
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
        scale={[0.3, 0.3, 0.3]}
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

// Main Hero3D component with better mobile responsiveness
export default function Hero3D() {
  const t = useTranslations('hero');
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted) {
    return (
      <section className="relative h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] bg-white flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-millo-blue">Millo</span>
            <span className="text-millo-red">Color</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600">Loading 3D Scene...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] bg-white overflow-hidden">
      <Canvas 
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        camera={{ 
          position: [0, 0, isMobile ? 4 : 5], 
          fov: isMobile ? 60 : 50 
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#FFFFFF', 0);
        }}
        className="w-full h-full"
        dpr={[1, 2]} // Optimize for different pixel densities
      >
        <Scene />
      </Canvas>
      
      {/* CTA Button */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-12 left-1/2 transform -translate-x-1/2 z-10">
        <Link 
          href="/products" 
          className="inline-flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-medium tracking-wider text-white rounded-md bg-millo-red hover:bg-red-700 transition-colors duration-300 ease-out shadow-lg"
        >
          {t('cta')}
        </Link>
      </div>
    </section>
  );
}
