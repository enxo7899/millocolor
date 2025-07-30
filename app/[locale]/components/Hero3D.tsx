"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { Text, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import gsap from 'gsap';
import SprayParticles from './SprayParticles';

// Only preload on client-side
if (typeof window !== 'undefined') {
  useGLTF.preload('/models/spray_gun.glb');
}

// Loading fallback component
function LoadingFallback() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshStandardMaterial color="#314485" />
    </mesh>
  );
}

// Main scene component with optimized animations
function Scene({ isMobile, onModelLoaded }: { isMobile: boolean; onModelLoaded: () => void }) {
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
  const fontSize = isMobile ? 0.55 : 1.2;
  const charGap = isMobile ? 0.04 : 0.08;

  // Measure and center the text group after mount with null checks
  useEffect(() => {
    if (milloTextRef.current && colorTextRef.current) {
      const measureText = () => {
        try {
          // Add null checks and ensure geometry exists
          if (!milloTextRef.current?.geometry || !colorTextRef.current?.geometry) {
            return;
          }
          
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
        } catch (error) {
          console.warn('Text measurement failed, using default positions:', error);
          // Use fallback positions
          setMilloPosX(-1.0);
          setColorPosX(1.0);
        }
      };
      
      // Try immediately, then with delays for geometry to be ready
      measureText();
      const timeout1 = setTimeout(measureText, 100);
      const timeout2 = setTimeout(measureText, 300);
      
      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
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
      // Notify that model is loaded
      onModelLoaded();
      
      // Optimize the 3D model for better performance
      sprayGun.traverse((child: any) => {
        if (child.isMesh) {
          // Clone material only if necessary
          if (!child.material.userData?.optimized) {
            child.material = child.material.clone();
            child.material.metalness = 0.8;
            child.material.roughness = 0.2;
            child.material.userData = { optimized: true };
          }
          
          // Optimize geometry
          if (child.geometry) {
            child.geometry.computeBoundingBox();
            child.geometry.computeBoundingSphere();
            
            // Enable frustum culling
            child.frustumCulled = true;
            
            // Optimize for static meshes
            child.matrixAutoUpdate = false;
            child.updateMatrix();
          }
        }
      });
    }
  }, [sprayGun, onModelLoaded]);

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
        position={[0, -1.1, 0]}
        fontSize={isMobile ? 0.20 : 0.28}
        color="#666666"
        anchorX="center"
        anchorY="middle"
      >Spray Like a Champion</Text>
      <primitive ref={gunRef} object={sprayGun} scale={isMobile ? [0.32, 0.32, 0.32] : [0.38, 0.38, 0.38]} position={[0, -0.8, 0]} />
      
      <SprayParticles 
        gunRef={gunRef} 
        sprayActive={sprayActive} 
        sprayColor={sprayColor} 
        isMobile={isMobile}
        milloTextRef={milloTextRef}
        colorTextRef={colorTextRef}
      />
    </>
  );
}

// Simplified Hero3D component
function Hero3DClient() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show loading until mounted
  if (!mounted) {
    return (
      <section className="relative h-[80vh] w-full bg-transparent flex items-center justify-center overflow-hidden">
        <div className="text-center px-4 z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-pulse">
            <span className="text-[#314485]">Millo</span>
            <span className="text-[#C73834]">Color</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-400">Loading...</p>
        </div>
      </section>
    );
  }
  
  // Render the 3D scene once mounted
  return (
    <section className="relative h-[80vh] w-full bg-transparent overflow-hidden">
      {!modelLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-[#314485]">Millo</span>
              <span className="text-[#C73834]">Color</span>
            </h1>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-[#314485] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-[#C73834] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-[#314485] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-400">Loading 3D Model...</p>
          </div>
        </div>
      )}
      
      <Canvas 
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        camera={{ 
          position: [0, 0, isMobile ? 4 : 6], 
          fov: isMobile ? 70 : 55
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000', 0);
        }}
        className="w-full h-full"
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene isMobile={isMobile} onModelLoaded={() => setModelLoaded(true)} />
        </Suspense>
      </Canvas>
    </section>
  );
}
// Main export with dynamic import to prevent SSR
export default dynamic(() => Promise.resolve(Hero3DClient), { 
  ssr: false,
  loading: () => (
    <section className="relative h-[80vh] w-full bg-transparent flex items-center justify-center overflow-hidden">
      <div className="text-center px-4 z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-pulse">
          <span className="text-[#314485]">Millo</span>
          <span className="text-[#C73834]">Color</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-400">Loading Hero Section...</p>
      </div>
    </section>
  )
});
