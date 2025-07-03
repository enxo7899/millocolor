"use client";

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import { useMemo, useRef, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import * as THREE from 'three';
import gsap from 'gsap';

export default function Hero3D() {
  const t = useTranslations('hero');
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <section className="relative h-[80vh] bg-white">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true }}
      >
        <Scene />
      </Canvas>
      
      {/* CTA Button - Positioned at bottom */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <Link 
          href="/products" 
          className="inline-flex items-center justify-center px-8 py-3 font-medium tracking-wider text-white rounded-md bg-millo-red hover:bg-red-700 transition-colors duration-300 ease-out"
        >
          {t('cta')}
        </Link>
      </div>
    </section>
  );
}

function Scene() {
  const { scene: sprayGun } = useGLTF('/models/spray_gun.glb');
  const milloTextRef = useRef<THREE.Mesh>(null);
  const colorTextRef = useRef<THREE.Mesh>(null);
  const gunRef = useRef<THREE.Object3D>(null);
  
  // Animation state
  const [gunPosition, setGunPosition] = useState([-8, 0.5, 2]);
  const [isSpraying, setIsSpraying] = useState(false);
  const [sprayColor, setSprayColor] = useState('#004a99');
  
  // GSAP animation setup
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1 });
    
    // Entry animation
    tl.to(gunPosition, { 
      x: -4, 
      duration: 1, 
      ease: "power2.out",
      onUpdate: () => setGunPosition([...gunPosition])
    }, 0);
    
    // Spray Millo
    tl.to(gunPosition, { 
      x: -0.5, 
      duration: 2.5, 
      ease: "power1.inOut",
      onUpdate: () => setGunPosition([...gunPosition]),
      onStart: () => {
        setIsSpraying(true);
        setSprayColor('#004a99');
      }
    }, 1);
    
    // Transition
    tl.to(gunPosition, { 
      x: 0.5, 
      duration: 0.5,
      onUpdate: () => setGunPosition([...gunPosition]),
      onStart: () => setIsSpraying(false)
    }, 3.5);
    
    // Spray Color
    tl.to(gunPosition, { 
      x: 4, 
      duration: 2.5,
      onUpdate: () => setGunPosition([...gunPosition]),
      onStart: () => {
        setIsSpraying(true);
        setSprayColor('#d7282f');
      }
    }, 4);
    
    // Exit
    tl.to(gunPosition, { 
      x: 8, 
      duration: 1.5,
      onUpdate: () => setGunPosition([...gunPosition])
    }, 6.5);
    
    return () => tl.kill();
  }, []);
  
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      
      {/* 3D Text */}
      <Text
        ref={milloTextRef}
        position={[-2.5, 0.5, 0]}
        fontSize={2}
        color="#CCCCCC"
        anchorX="center"
        anchorY="middle"
      >
        Millo
      </Text>
      
      <Text
        ref={colorTextRef}
        position={[1.5, 0.5, 0]}
        fontSize={2}
        color="#CCCCCC"
        anchorX="center"
        anchorY="middle"
      >
        Color
      </Text>
      
      {/* Slogan */}
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.5}
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
        position={gunPosition}
        scale={[0.8, 0.8, 0.8]}
        rotation={[0, Math.PI/4, -Math.PI/12]}
      />
      
      {/* Simple Particle System */}
      {isSpraying && <SprayParticles color={sprayColor} />}
    </>
  );
}

interface SprayParticlesProps {
  color: string;
}

function SprayParticles({ color }: SprayParticlesProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const geometry = useMemo(() => new THREE.BufferGeometry(), []);
  const material = useMemo(() => new THREE.PointsMaterial({
    color: color,
    size: 0.1,
    transparent: true,
    opacity: 0.6
  }), [color]);
  
  // Generate some random particles
  useEffect(() => {
    if (!geometry) return;
    
    // Create 100 particles with random positions
    const positions = new Float32Array(300);
    for (let i = 0; i < 300; i += 3) {
      positions[i] = (Math.random() - 0.5) * 2; // x
      positions[i+1] = (Math.random() - 0.5) * 2; // y
      positions[i+2] = (Math.random() - 0.5) * 2; // z
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  }, [geometry]);
  
  useFrame(() => {
    // Simple particle animation
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.01;
    }
  });
  
  return (
    <points ref={particlesRef} geometry={geometry} material={material} />
  );
}
