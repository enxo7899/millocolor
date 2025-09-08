"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { Text, useGLTF, Environment, PerspectiveCamera, useFont } from '@react-three/drei';
import { useRef, useState, useEffect, useMemo, Suspense, useLayoutEffect } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import gsap from 'gsap';
import SprayParticles from './SprayParticles';
import { useResponsiveScaling } from '../hooks/useResponsiveScaling';
import TypewriterText from './TypewriterText';
import VideoBackground from './VideoBackground';
import CanvasRecommendedProps from './CanvasRecommendedProps';
import AnimationHealthMonitor from './AnimationHealthMonitor';

// Only preload on client-side
if (typeof window !== 'undefined') {
  useGLTF.preload('/models/spray_gun.glb');
  useFont.preload('/fonts/Baloo2-Bold.ttf');
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

  const scale = useResponsiveScaling();
  const [milloColor, setMilloColor] = useState(new THREE.Color('#CCCCCC'));
  const [colorTextColor, setColorTextColor] = useState(new THREE.Color('#CCCCCC'));
  const [milloPosX, setMilloPosX] = useState(-1.0);
  const [colorPosX, setColorPosX] = useState(1.0);
  const [centerOffset, setCenterOffset] = useState(0);
  const [sprayActive, setSprayActive] = useState(false);
  const [sprayColor, setSprayColor] = useState<THREE.Color>(new THREE.Color('#314485'));
  const [animationReady, setAnimationReady] = useState(false);
  const [forceRender, setForceRender] = useState(0);
  const [modelLoaded, setModelLoaded] = useState(false);


  // Reduced fontSize to compensate for capital letters being larger
  const fontSize = 0.85 * scale; // Reduced from 1.2 to 0.85 to maintain visual size with capitals
  // Dynamic letter spacing: reduce spacing on smaller screens first, then scale text
  const letterSpacing = 0.006 * scale; // Slightly tighter letter spacing for capital letters
  const charGap = letterSpacing * 1.8; // Slightly reduced word gap for more compact text

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

  // More reliable animation initialization using useLayoutEffect
  useLayoutEffect(() => {
    let retryCount = 0;
    const MAX_RETRIES = 50; // Increased retries
    const RETRY_DELAY = 100; // Faster retries
    
    const initializeAnimation = () => {
      const checkComponentsReady = () => {
        const milloMat = milloTextRef.current?.material as THREE.MeshStandardMaterial;
        const colorMat = colorTextRef.current?.material as THREE.MeshStandardMaterial;
        const gunObject = gunRef.current;
        
        const isReady = milloMat && colorMat && gunObject && 
                       milloTextRef.current?.geometry && 
                       colorTextRef.current?.geometry &&
                       milloMat.color && colorMat.color;
        
        console.log(`Animation check ${retryCount + 1}:`, {
          milloMat: !!milloMat,
          colorMat: !!colorMat, 
          gunObject: !!gunObject,
          milloGeometry: !!milloTextRef.current?.geometry,
          colorGeometry: !!colorTextRef.current?.geometry,
          ready: isReady
        });
        
        return isReady;
      };
      
      if (checkComponentsReady()) {
        console.log('🎉 Animation components ready - starting animation!');
        setAnimationReady(true);
      } else {
        retryCount++;
        if (retryCount < MAX_RETRIES) {
          console.log(`⏳ Components not ready, retry ${retryCount}/${MAX_RETRIES} in ${RETRY_DELAY}ms...`);
          setTimeout(initializeAnimation, RETRY_DELAY);
        } else {
          console.warn('⚠️ Max retries reached, forcing animation start...');
          setAnimationReady(true);
        }
      }
    };
    
    // Start initialization immediately
    initializeAnimation();
    
    // Fallback: force animation start after 3 seconds regardless
    const fallbackTimeout = setTimeout(() => {
      if (!animationReady) {
        console.warn('🚨 Fallback: Forcing animation start after timeout');
        setAnimationReady(true);
      }
    }, 3000);
    
    return () => {
      clearTimeout(fallbackTimeout);
    };
  }, [isMobile, animationReady]);
  
  // Also trigger animation when model loads
  useEffect(() => {
    if (modelLoaded && !animationReady) {
      console.log('🎯 Model loaded, triggering animation check...');
      setAnimationReady(true);
    }
  }, [modelLoaded, animationReady]);

  useEffect(() => {
    // Only create timeline when animation is ready
    if (!animationReady || !gunRef.current || !milloTextRef.current || !colorTextRef.current) return;
    const milloMat = milloTextRef.current.material as THREE.MeshStandardMaterial;
    const colorMat = colorTextRef.current.material as THREE.MeshStandardMaterial;
    if (!milloMat || !colorMat) return;
    
    console.log('Creating GSAP timeline...');
    const tl = gsap.timeline({ 
      repeat: -1, 
      repeatDelay: 2,
      onRepeat: () => {
        // Only reset Color text, keep Millo's color progression smooth
        setMilloColor(new THREE.Color('#CCCCCC'));
        setColorTextColor(new THREE.Color('#CCCCCC'));
        if (milloMat) milloMat.color.set('#CCCCCC');
        if (colorMat) colorMat.color.set('#CCCCCC');
      }
    });
    const gun = gunRef.current;
    const transitionX = colorPosX - charGap / 2;
    const verticalCenter = isMobile ? -0.5 : -0.8; // Higher position on mobile
    gun.position.set(isMobile ? milloPosX - 0.8 : milloPosX - 1.2, verticalCenter, 1.5);
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
        // Use global timeline progress like Color word for smooth transition
        const progress = tl.progress();
        const c = new THREE.Color('#CCCCCC').lerp(new THREE.Color('#314485'), Math.min(1, progress * 3)); // Faster transition
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
        // Use global timeline progress like Color word for smooth transition
        const progress = tl.progress();
        const c = new THREE.Color('#CCCCCC').lerp(new THREE.Color('#314485'), Math.min(1, progress * 3)); // Faster transition
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
        // Use global timeline progress like Color word for smooth transition
        const progress = tl.progress();
        const c = new THREE.Color('#CCCCCC').lerp(new THREE.Color('#314485'), Math.min(1, progress * 3)); // Faster transition
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
  }, [animationReady, isMobile, milloPosX, colorPosX, fontSize]);

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
      <AnimationHealthMonitor 
        animationReady={animationReady} 
        isMobile={isMobile} 
        componentName="Hero3D" 
      />
      <PerspectiveCamera makeDefault position={[0, 0, isMobile ? 3.5 : 5]} fov={isMobile ? 65 : 50} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <Environment preset="city" />
      <Suspense fallback={<LoadingFallback />}>
        <Text
          ref={milloTextRef}
          font="/fonts/Baloo2-Bold.ttf"
          position={[milloPosX, 0, 0]}
          fontSize={fontSize}
          color={milloColor}
          anchorX="left"
          anchorY="middle"
          letterSpacing={letterSpacing}
        >
          MILLO
        </Text>
        <Text
          ref={colorTextRef}
          font="/fonts/Baloo2-Bold.ttf"
          position={[colorPosX, 0, 0]}
          fontSize={fontSize}
          color={colorTextColor}
          anchorX="left"
          anchorY="middle"
          letterSpacing={letterSpacing}
        >
          COLOR
        </Text>
      </Suspense>

      <primitive ref={gunRef} object={sprayGun} scale={0.12 + (scale * 0.15)} position={[0, -0.8, 0]} />
      
      <SprayParticles
        gunRef={gunRef}
        sprayActive={sprayActive}
        sprayColor={sprayColor}
        scaleFactor={scale}
        milloTextRef={milloTextRef}
        colorTextRef={colorTextRef}
      />
    </>
  );
}

// WebGL context cleanup utility - removed to avoid destroying active contexts

// Simplified Hero3D component
function Hero3DClient() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);
  
  useEffect(() => {
    setMounted(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Show loading until mounted
  if (!mounted) {
    return (
      <section className="relative h-[80vh] w-full bg-transparent flex items-center justify-center overflow-hidden">
        <VideoBackground 
          videoSrc="/videos/hero.mp4" 
          className="z-0"
        />
        <div className="text-center px-4 z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold mb-6 animate-pulse">
            <span className="text-[#314485]">MILLO</span>
            <span className="text-[#C73834]">COLOR</span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-400">Loading...</p>
        </div>
      </section>
    );
  }
  
  // Render the 3D scene once mounted
  return (
    <section className="relative h-[80vh] w-full bg-transparent overflow-hidden">
      {/* Video Background */}
      <VideoBackground 
        videoSrc="/videos/hero.mp4" 
        className="z-0"
      />
      {!modelLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-gradient-to-br from-gray-900/80 to-black/80">
          <div className="text-center px-4 w-full max-w-2xl">
            <div className="mb-8 flex justify-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold">
                <span className="text-[#314485]">MILLO</span>
                <span className="text-[#C73834]">COLOR</span>
              </h1>
            </div>
            
            {/* Progress bar container */}
            <div className="mb-8 mx-auto max-w-md">
              <div className="relative pt-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[#314485] bg-[#314485]/20">
                      Loading 3D Model
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-[#C73834]">
                      Initializing...
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-800">
                  <div 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#314485] to-[#C73834] transition-all duration-500 ease-in-out"
                    style={{ width: '45%' }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Animated spray effect */}
            <div className="relative h-24 mb-8 flex items-center justify-center">
              <div className="absolute w-3 h-3 rounded-full bg-[#314485] animate-ping opacity-75"></div>
              <div className="absolute w-3 h-3 rounded-full bg-[#314485] animate-pulse"></div>
              
              {/* Spray particles animation */}
              <div className="absolute flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#C73834] opacity-80"
                    style={{
                      animation: `spray 1.5s infinite ${i * 0.2}s`,
                      transform: `translateX(${i * 10}px) translateY(${Math.sin(i) * 5}px)`
                    }}
                  ></div>
                ))}
              </div>
            </div>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-400 font-light">
              Preparing your immersive experience...
            </p>
          </div>
        </div>
      )}
      
      {/* Typewriter Subtitle Overlay - Only show when model is loaded */}
      {modelLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <div className="text-center px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold opacity-0">
              <span className="text-[#314485]">MILLO</span>
              <span className="text-[#C73834]">COLOR</span>
            </h1>
            <h2 className="font-montserrat font-bold text-white mt-24 sm:mt-28 md:mt-32 lg:mt-36 xl:mt-40 2xl:mt-44">
              <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">
                Spray Like a{' '}
                <TypewriterText 
                  strings={['Champion', 'Pro']}
                  colors={['#314485', '#C73834']}
                  className="inline-block font-montserrat"
                />
              </span>
            </h2>
          </div>
        </div>
      )}
      
      <CanvasRecommendedProps 
        key={`hero3d-canvas-${canvasKey}`}
        className="w-full h-full relative z-20"
        camera={{ 
          position: [0, 0, isMobile ? 4 : 6], 
          fov: isMobile ? 70 : 55
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000', 0);
          console.log('✅ New WebGL context created successfully');
        }}
        onError={() => {
          // increment key to recreate the canvas on error
          setCanvasKey(prev => prev + 1);
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene isMobile={isMobile} onModelLoaded={() => setModelLoaded(true)} />
        </Suspense>
      </CanvasRecommendedProps>
    </section>
  );
}
// Main export with dynamic import to prevent SSR
export default dynamic(() => Promise.resolve(Hero3DClient), { 
  ssr: false,
  loading: () => (
    <section className="relative h-[80vh] w-full bg-transparent flex items-center justify-center overflow-hidden">
      <VideoBackground 
        videoSrc="/videos/hero.mp4" 
        className="z-0"
      />
      <div className="text-center px-4 z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold mb-6 animate-pulse">
          <span className="text-[#314485]">Millo</span>
          <span className="text-[#C73834]">Color</span>
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-400">Loading Hero Section...</p>
      </div>
    </section>
  )
});
