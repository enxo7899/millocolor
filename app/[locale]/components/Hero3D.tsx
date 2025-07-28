"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { Text, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import { useRef, useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import * as THREE from 'three';
import gsap from 'gsap';
import SprayParticles from './SprayParticles';

// Main scene component with simplified animations
function Scene({ isMobile }: { isMobile: boolean }) {
  const { scene: sprayGun } = useGLTF('/models/spray_gun.glb');
  const gunRef = useRef<THREE.Object3D>(null);
  const milloTextRef = useRef<any>(null);
  const colorTextRef = useRef<any>(null);
  const [milloColor, setMilloColor] = useState(new THREE.Color('#CCCCCC'));
  const [colorTextColor, setColorTextColor] = useState(new THREE.Color('#CCCCCC'));
  const [milloPosX, setMilloPosX] = useState(-1.0);
  const [colorPosX, setColorPosX] = useState(1.0);
  const [centerOffset, setCenterOffset] = useState(0);
  const [sprayActive, setSprayActive] = useState(false);
  const [sprayColor, setSprayColor] = useState<THREE.Color>(new THREE.Color('#314485'));
  const fontSize = isMobile ? 0.6 : 0.8;
  const charGap = 0.05;

  // Measure and center the text group after mount
  useEffect(() => {
    if (milloTextRef.current && colorTextRef.current) {
      setTimeout(() => {
        const bboxMillo = milloTextRef.current.geometry.boundingBox;
        const bboxColor = colorTextRef.current.geometry.boundingBox;
        if (bboxMillo && bboxColor) {
          const widthMillo = bboxMillo.max.x - bboxMillo.min.x;
          const widthColor = bboxColor.max.x - bboxColor.min.x;
          const totalWidth = widthMillo + charGap + widthColor;
          // Center the group
          setMilloPosX(-totalWidth / 2);
          setColorPosX(-totalWidth / 2 + widthMillo + charGap);
          setCenterOffset(totalWidth / 2);
        }
      }, 100);
    }
  }, [milloTextRef.current, colorTextRef.current, fontSize, isMobile]);

  useEffect(() => {
    if (!gunRef.current || !milloTextRef.current || !colorTextRef.current) return;
    const milloMat = milloTextRef.current.material as THREE.MeshStandardMaterial;
    const colorMat = colorTextRef.current.material as THREE.MeshStandardMaterial;
    const tl = gsap.timeline({ 
      repeat: -1, 
      repeatDelay: 2,
      onRepeat: () => {
        setMilloColor(new THREE.Color('#CCCCCC'));
        setColorTextColor(new THREE.Color('#CCCCCC'));
        if (milloMat) milloMat.color.set('#CCCCCC');
        if (colorMat) colorMat.color.set('#CCCCCC');
      }
    });
    const gun = gunRef.current;
    const transitionX = colorPosX - charGap / 2;
    const verticalCenter = -0.7; // Move gun lower to align nozzle with text center
    gun.position.set(isMobile ? milloPosX - 1.2 : milloPosX - 1.7, verticalCenter, 1.5);
    gun.rotation.set(0, 0, -Math.PI/14);

    // --- 2.5 passes over 'Millo' ---
    const milloStart = milloPosX;
    const milloEnd = transitionX;
    const colorStart = colorPosX;
    const colorEnd = colorPosX + (colorTextRef.current?.geometry.boundingBox?.max.x - colorTextRef.current?.geometry.boundingBox?.min.x || 1.5);
    let t = 0;
    let passDuration = 0.9;
    let halfPass = passDuration / 2;
    
    // Pass 1: Left to right
    tl.to(gun.position, {
      x: milloStart,
      y: verticalCenter - 0.08,
      z: 1.5,
      duration: 0.7,
      ease: 'power2.out',
    }, t);
    tl.to(gun.rotation, {
      y: -Math.PI/2.5,
      x: 0.08,
      duration: 0.5,
      ease: 'power2.out',
    }, t + 0.3);
    t += 0.7;
    
    tl.to(gun.position, {
      x: milloEnd,
      y: verticalCenter + 0.08,
      z: 1.2,
      duration: passDuration,
      ease: 'power2.inOut',
      onStart: () => {
        setSprayActive(true);
        setSprayColor(new THREE.Color('#314485'));
      },
      onUpdate: () => {
        const progress = tl.progress();
        const c = new THREE.Color('#CCCCCC').lerp(new THREE.Color('#314485'), Math.min(1, (progress - 0.1) * 2));
        setMilloColor(c);
        if (milloMat) milloMat.color.copy(c);
      },
      onComplete: () => {
        setMilloColor(new THREE.Color('#314485'));
        if (milloMat) milloMat.color.set('#314485');
        setSprayActive(false);
      },
    }, t);
    tl.to(gun.rotation, {
      y: -Math.PI/2.2,
      x: -0.08,
      duration: 0.3,
      ease: 'power1.inOut',
    }, t);
    t += passDuration;
    
    // Pass 2: Right to left
    tl.to(gun.position, {
      x: milloStart,
      y: verticalCenter - 0.08,
      z: 1.2,
      duration: passDuration,
      ease: 'power2.inOut',
      onStart: () => {
        setSprayActive(true);
        setSprayColor(new THREE.Color('#314485'));
      },
      onUpdate: () => {
        const progress = tl.progress();
        const c = new THREE.Color('#CCCCCC').lerp(new THREE.Color('#314485'), Math.min(1, (progress - 0.1) * 2));
        setMilloColor(c);
        if (milloMat) milloMat.color.copy(c);
      },
      onComplete: () => {
        setMilloColor(new THREE.Color('#314485'));
        if (milloMat) milloMat.color.set('#314485');
        setSprayActive(false);
      },
    }, t);
    tl.to(gun.rotation, {
      y: -Math.PI/2.5,
      x: 0.08,
      duration: 0.3,
      ease: 'power1.inOut',
    }, t);
    t += passDuration;
    
    // Pass 2.5: Left to middle
    tl.to(gun.position, {
      x: (milloStart + milloEnd) / 2,
      y: verticalCenter,
      z: 1.2,
      duration: halfPass,
      ease: 'power2.inOut',
      onStart: () => {
        setSprayActive(true);
        setSprayColor(new THREE.Color('#314485'));
      },
      onUpdate: () => {
        const progress = tl.progress();
        const c = new THREE.Color('#CCCCCC').lerp(new THREE.Color('#314485'), Math.min(1, (progress - 0.1) * 2));
        setMilloColor(c);
        if (milloMat) milloMat.color.copy(c);
      },
      onComplete: () => {
        setMilloColor(new THREE.Color('#314485'));
        if (milloMat) milloMat.color.set('#314485');
        setSprayActive(false);
      },
    }, t);
    tl.to(gun.rotation, {
      y: -Math.PI/2.2,
      x: 0,
      duration: 0.3,
      ease: 'power1.inOut',
    }, t);
    t += halfPass;
    
    // Move to start of 'Color'
    tl.to(gun.position, {
      x: colorStart,
      y: verticalCenter - 0.08,
      z: 1.2,
      duration: 0.7,
      ease: 'power2.inOut',
    }, t);
    tl.to(gun.rotation, {
      y: -Math.PI/2.5,
      x: 0.08,
      duration: 0.5,
      ease: 'power2.out',
    }, t + 0.3);
    t += 0.7;
    
    // --- 2.5 passes over 'Color' ---
    // Pass 1: Left to right
    tl.to(gun.position, {
      x: colorEnd,
      y: verticalCenter + 0.08,
      z: 1.2,
      duration: passDuration,
      ease: 'power2.inOut',
      onStart: () => {
        setSprayActive(true);
        setSprayColor(new THREE.Color('#C73834'));
      },
      onUpdate: () => {
        const progress = tl.progress();
        const c = new THREE.Color('#CCCCCC').lerp(new THREE.Color('#C73834'), Math.min(1, (progress - 0.3) * 2));
        setColorTextColor(c);
        if (colorMat) colorMat.color.copy(c);
      },
      onComplete: () => {
        setColorTextColor(new THREE.Color('#C73834'));
        if (colorMat) colorMat.color.set('#C73834');
        setSprayActive(false);
      },
    }, t);
    tl.to(gun.rotation, {
      y: -Math.PI/2.2,
      x: -0.08,
      duration: 0.3,
      ease: 'power1.inOut',
    }, t);
    t += passDuration;
    
    // Pass 2: Right to left
    tl.to(gun.position, {
      x: colorStart,
      y: verticalCenter - 0.08,
      z: 1.2,
      duration: passDuration,
      ease: 'power2.inOut',
      onStart: () => {
        setSprayActive(true);
        setSprayColor(new THREE.Color('#C73834'));
      },
      onUpdate: () => {
        const progress = tl.progress();
        const c = new THREE.Color('#CCCCCC').lerp(new THREE.Color('#C73834'), Math.min(1, (progress - 0.3) * 2));
        setColorTextColor(c);
        if (colorMat) colorMat.color.copy(c);
      },
      onComplete: () => {
        setColorTextColor(new THREE.Color('#C73834'));
        if (colorMat) colorMat.color.set('#C73834');
        setSprayActive(false);
      },
    }, t);
    tl.to(gun.rotation, {
      y: -Math.PI/2.5,
      x: 0.08,
      duration: 0.3,
      ease: 'power1.inOut',
    }, t);
    t += passDuration;
    
    // Pass 2.5: Left to middle
    tl.to(gun.position, {
      x: (colorStart + colorEnd) / 2,
      y: verticalCenter,
      z: 1.2,
      duration: halfPass,
      ease: 'power2.inOut',
      onStart: () => {
        setSprayActive(true);
        setSprayColor(new THREE.Color('#C73834'));
      },
      onUpdate: () => {
        const progress = tl.progress();
        const c = new THREE.Color('#CCCCCC').lerp(new THREE.Color('#C73834'), Math.min(1, (progress - 0.3) * 2));
        setColorTextColor(c);
        if (colorMat) colorMat.color.copy(c);
      },
      onComplete: () => {
        setColorTextColor(new THREE.Color('#C73834'));
        if (colorMat) colorMat.color.set('#C73834');
        setSprayActive(false);
      },
    }, t);
    tl.to(gun.rotation, {
      y: -Math.PI/2.2,
      x: 0,
      duration: 0.3,
      ease: 'power1.inOut',
    }, t);
    t += halfPass;
    
    // Move offscreen right
    tl.to(gun.position, {
      x: isMobile ? colorEnd + 1.2 : colorEnd + 1.7,
      y: verticalCenter,
      z: 1.5,
      duration: 0.7,
      ease: 'power2.inOut',
    }, t);
    
    return () => { tl.kill(); };
  }, [isMobile, milloPosX, colorPosX, fontSize]);

  useFrame(() => {
    if (gunRef.current) {
      const time = performance.now() * 0.001;
      const wobble = Math.sin(time * 6) * 0.002 + Math.sin(time * 13) * 0.001;
      gunRef.current.position.y += wobble;
    }
  });

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
      <PerspectiveCamera makeDefault position={[0, 0, isMobile ? 3.5 : 5]} fov={isMobile ? 65 : 50} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <Environment preset="city" />
      <Text
        ref={milloTextRef}
        position={[milloPosX, 0, 0]}
        fontSize={fontSize}
        color={milloColor.getStyle()}
        anchorX="left"
        anchorY="middle"
        letterSpacing={charGap}
      >Millo</Text>
      <Text
        ref={colorTextRef}
        position={[colorPosX, 0, 0]}
        fontSize={fontSize}
        color={colorTextColor.getStyle()}
        anchorX="left"
        anchorY="middle"
        letterSpacing={charGap}
      >Color</Text>
      <Text
        position={[0, -1.0, 0]}
        fontSize={isMobile ? 0.18 : 0.25}
        color="#666666"
        anchorX="center"
        anchorY="middle"
      >Spray Like a Champion</Text>
      <primitive ref={gunRef} object={sprayGun} scale={[0.3, 0.3, 0.3]} position={[0, -0.6, 0]} />
      
      <SprayParticles 
        gunRef={gunRef} 
        sprayActive={sprayActive} 
        sprayColor={sprayColor} 
        isMobile={isMobile} 
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
            <span className="text-[#314485]">Millo</span>
            <span className="text-[#C73834]">Color</span>
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
          position: [0, 0, isMobile ? 3.5 : 5], 
          fov: isMobile ? 65 : 50 
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#FFFFFF', 0);
        }}
        className="w-full h-full"
        dpr={[1, 2]} // Optimize for different pixel densities
      >
        <Scene isMobile={isMobile} />
      </Canvas>
      
      {/* CTA Button */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-12 left-1/2 transform -translate-x-1/2 z-10">
        <Link 
          href="/products" 
          className="inline-flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-medium tracking-wider text-white rounded-md bg-[#C73834] hover:bg-red-700 transition-colors duration-300 ease-out shadow-lg"
        >
          {t('cta')}
        </Link>
      </div>
    </section>
  );
}
