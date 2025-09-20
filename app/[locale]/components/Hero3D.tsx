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

// Enhanced asset preloading with progress tracking
let assetsPreloaded = false;
let preloadProgress = 0;

if (typeof window !== 'undefined') {
  const preloadAssets = async () => {
    try {
      console.log('🔄 Starting asset preload...');
      
      // Track individual asset loading
      const modelPromise = Promise.resolve(useGLTF.preload('/models/spray_gun.opt.glb')).then(() => {
        preloadProgress += 50;
        console.log('📦 3D Model preloaded');
      });
      
      const fontPromise = Promise.resolve(useFont.preload('/fonts/Baloo2-Bold.ttf')).then(() => {
        preloadProgress += 50;
        console.log('🔤 Font preloaded');
      });
      
      await Promise.all([modelPromise, fontPromise]);
      assetsPreloaded = true;
      console.log('✅ All assets preloaded successfully');
    } catch (error) {
      console.warn('⚠️ Asset preload failed, will load on demand:', error);
      // Still mark as "preloaded" to prevent blocking
      assetsPreloaded = true;
    }
  };
  preloadAssets();
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
  const { scene: sprayGun } = useGLTF('/models/spray_gun.opt.glb');
  const gunRef = useRef<THREE.Object3D>(null);
  const milloTextRef = useRef<THREE.Mesh>(null);
  const colorTextRef = useRef<THREE.Mesh>(null);

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
  const [fontLoaded, setFontLoaded] = useState(false);
  const [textGeometryReady, setTextGeometryReady] = useState(false);


  // Optimized fontSize and spacing for better performance
  const fontSize = 0.8 * scale; // Further reduced for better performance
  const letterSpacing = 0.005 * scale; // Tighter spacing for optimization
  const charGap = letterSpacing * 1.6; // Reduced gap for compactness

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

  // Enhanced animation initialization with better dependency tracking
  useEffect(() => {
    let mounted = true;
    let checkInterval: NodeJS.Timeout;
    let retryCount = 0;
    const MAX_RETRIES = 100;
    
    const checkAllDependencies = () => {
      if (!mounted) return false;
      
      const milloMat = milloTextRef.current?.material as THREE.MeshStandardMaterial;
      const colorMat = colorTextRef.current?.material as THREE.MeshStandardMaterial;
      const gunObject = gunRef.current;
      const milloGeom = milloTextRef.current?.geometry;
      const colorGeom = colorTextRef.current?.geometry;
      
      const allReady = milloMat && colorMat && gunObject && milloGeom && colorGeom &&
                      modelLoaded && textGeometryReady;
      
      console.log(`🔍 Dependency check ${retryCount + 1}:`, {
        milloMat: !!milloMat,
        colorMat: !!colorMat,
        gunObject: !!gunObject,
        milloGeom: !!milloGeom,
        colorGeom: !!colorGeom,
        modelLoaded,
        textGeometryReady,
        allReady
      });
      
      return allReady;
    };
    
    const startAnimationCheck = () => {
      if (!mounted) return;
      
      if (checkAllDependencies()) {
        console.log('🎉 All dependencies ready - starting animation!');
        setAnimationReady(true);
        return;
      }
      
      retryCount++;
      if (retryCount < MAX_RETRIES) {
        checkInterval = setTimeout(startAnimationCheck, 25); // Very frequent checks
      } else {
        console.warn('⚠️ Max retries reached - forcing animation start');
        setAnimationReady(true);
      }
    };
    
    // Wait a bit for components to mount, then start checking
    const initialDelay = setTimeout(startAnimationCheck, 100);
    
    // Absolute fallback - start animation after 3 seconds no matter what
    const absoluteFallback = setTimeout(() => {
      if (!animationReady && mounted) {
        console.log('🚨 Absolute fallback - forcing animation start');
        setAnimationReady(true);
      }
    }, 3000);
    
    return () => {
      mounted = false;
      clearTimeout(initialDelay);
      clearTimeout(checkInterval);
      clearTimeout(absoluteFallback);
    };
  }, [modelLoaded, textGeometryReady, animationReady]);

  useEffect(() => {
    // Only create timeline when animation is ready
    if (!animationReady || !gunRef.current || !milloTextRef.current || !colorTextRef.current) return;
    const milloMat = milloTextRef.current.material as THREE.MeshStandardMaterial;
    const colorMat = colorTextRef.current.material as THREE.MeshStandardMaterial;
    if (!milloMat || !colorMat) return;
    
    console.log('🎬 Creating optimized GSAP timeline...');
    const tl = gsap.timeline({ 
      repeat: -1, 
      repeatDelay: 1.5, // Reduced delay for better user experience
      onRepeat: () => {
        // Reset colors efficiently
        const grayColor = new THREE.Color('#CCCCCC');
        setMilloColor(grayColor);
        setColorTextColor(grayColor);
        milloMat.color.copy(grayColor);
        colorMat.color.copy(grayColor);
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
    const colorEnd = colorPosX + ((colorTextRef.current?.geometry.boundingBox?.max.x ?? 0) - (colorTextRef.current?.geometry.boundingBox?.min.x ?? 0) || 1.5);
    let t = 0;
    const passDuration = 0.9;
    const halfPass = passDuration / 2;
    
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
    if (gunRef.current && animationReady) {
      // Reduced wobble for better performance and smoother animation
      const time = performance.now() * 0.0008;
      const wobble = Math.sin(time * 4) * 0.001;
      gunRef.current.position.y += wobble;
    }
  });

  useEffect(() => {
    if (sprayGun) {
      // Notify that model is loaded immediately
      setModelLoaded(true);
      onModelLoaded();
      
      // Optimize the 3D model for better performance
      sprayGun.traverse((child: THREE.Object3D) => {
        if ('isMesh' in child && child.isMesh) {
          const mesh = child as THREE.Mesh;
          // Clone material only if necessary
          const material = mesh.material as THREE.Material;
          if (!material.userData?.optimized) {
            mesh.material = material.clone();
            const clonedMaterial = mesh.material as THREE.MeshStandardMaterial;
            if (clonedMaterial.metalness !== undefined) {
              clonedMaterial.metalness = 0.8;
            }
            if (clonedMaterial.roughness !== undefined) {
              clonedMaterial.roughness = 0.2;
            }
            clonedMaterial.userData = { optimized: true };
          }
          
          // Optimize geometry
          if (mesh.geometry) {
            mesh.geometry.computeBoundingBox();
            mesh.geometry.computeBoundingSphere();
            
            // Enable frustum culling
            mesh.frustumCulled = true;
            
            // Optimize for static meshes - but keep auto update for animation
            mesh.matrixAutoUpdate = true; // Keep this true for smooth animation
            
            // Dispose of unused geometry data
            if (mesh.geometry.attributes.normal) {
              mesh.geometry.attributes.normal.needsUpdate = false;
            }
            if (mesh.geometry.attributes.uv) {
              mesh.geometry.attributes.uv.needsUpdate = false;
            }
          }
        }
      });
      
      console.log('🎯 3D Model loaded and optimized');
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
          onSync={() => {
            console.log('📝 MILLO text geometry ready');
            if (colorTextRef.current?.geometry) {
              setTextGeometryReady(true);
            }
          }}
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
          onSync={() => {
            console.log('📝 COLOR text geometry ready');
            if (milloTextRef.current?.geometry) {
              setTextGeometryReady(true);
            }
          }}
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
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [forceStart, setForceStart] = useState(false);
  const [realLoadingProgress, setRealLoadingProgress] = useState(0);
  const [animationFailureDetected, setAnimationFailureDetected] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Real progress tracking based on actual loading states
    const updateRealProgress = () => {
      let progress = 0;
      
      // Check preload progress
      progress += (preloadProgress / 100) * 30; // 30% for asset preload
      
      // Check if components are mounted
      if (mounted) progress += 20; // 20% for mounting
      
      // Check if canvas is ready
      const canvas = document.querySelector('canvas');
      if (canvas) progress += 20; // 20% for canvas
      
      // Check if model is loaded
      if (modelLoaded) progress += 30; // 30% for model
      
      setRealLoadingProgress(Math.min(progress, 95)); // Cap at 95% until animation starts
    };
    
    const progressUpdateInterval = setInterval(updateRealProgress, 100);
    
    // Simulate loading progress with guaranteed completion
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) return prev; // Stop at 90% until model loads
        return prev + Math.random() * 5; // Slower fake progress
      });
    }, 300);
    
    // Animation failure detection and smart reload
    const animationHealthCheck = setTimeout(() => {
      const canvas = document.querySelector('canvas');
      const hasAnimation = document.querySelector('[data-animation-active]');
      
      if (canvas && !hasAnimation && !modelLoaded) {
        console.warn('🚨 Animation failure detected - components loaded but animation not starting');
        setAnimationFailureDetected(true);
        
        // Smart reload after giving user a moment to see the issue
        setTimeout(() => {
          console.log('🔄 Smart reload triggered due to animation failure');
          window.location.reload();
        }, 2000);
      }
    }, 5000);
    
    // Force start animation after 4 seconds if nothing has loaded
    const forceStartTimer = setTimeout(() => {
      console.log('🚀 Force starting animation for better UX');
      setForceStart(true);
      setModelLoaded(true);
      setLoadingProgress(100);
      setRealLoadingProgress(100);
    }, 4000);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearInterval(progressInterval);
      clearInterval(progressUpdateInterval);
      clearTimeout(forceStartTimer);
      clearTimeout(animationHealthCheck);
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
      {!modelLoaded && !forceStart && (
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
                      {Math.round(Math.max(realLoadingProgress, loadingProgress))}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-800">
                  <div 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#314485] to-[#C73834] transition-all duration-300 ease-in-out"
                    style={{ width: `${Math.min(Math.max(realLoadingProgress, loadingProgress), 100)}%` }}
                  ></div>
                </div>
                {animationFailureDetected && (
                  <div className="text-center text-yellow-400 text-sm mb-4">
                    ⚠️ Loading issue detected - Reloading automatically...
                  </div>
                )}
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
      
      {/* Typewriter Subtitle Overlay - Show when model is loaded or force started */}
      {(modelLoaded || forceStart) && (
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
        data-animation-active={modelLoaded || forceStart}
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
          <Scene isMobile={isMobile} onModelLoaded={() => {
            setModelLoaded(true);
            setLoadingProgress(100);
          }} />
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
