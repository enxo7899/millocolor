"use client";

import { useFrame } from '@react-three/fiber';
import { Text, useGLTF, Environment, PerspectiveCamera, useFont, useProgress } from '@react-three/drei';
import { useRef, useState, useEffect, Suspense, useCallback } from 'react';
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
const MODEL_PATH = '/models/spray_gun.opt.glb';
const FONT_PATH = '/fonts/Baloo2-Bold.ttf';

type SceneLoadingEvent = 'model-loaded' | 'text-ready' | 'animation-starting';

let preloadProgress = 0;

function isWebGLAvailable() {
  if (typeof window === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    );
  } catch (error) {
    console.warn('WebGL detection failed', error);
    return false;
  }
}

if (typeof window !== 'undefined') {
  const preloadAssets = async () => {
    try {
      console.log('🔄 Starting asset preload...');
      
      // Track individual asset loading
      const modelPromise = Promise.resolve(useGLTF.preload(MODEL_PATH)).then(() => {
        preloadProgress += 50;
        console.log('📦 3D Model preloaded');
      });
      
      const fontPromise = Promise.resolve(useFont.preload(FONT_PATH)).then(() => {
        preloadProgress += 50;
        console.log('🔤 Font preloaded');
      });
      
      await Promise.all([modelPromise, fontPromise]);
      console.log('✅ All assets preloaded successfully');
    } catch (error) {
      console.warn('⚠️ Asset preload failed, will load on demand:', error);
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
function Scene({
  isMobile,
  onSceneReady,
  onSceneStateChange
}: {
  isMobile: boolean;
  onSceneReady: () => void;
  onSceneStateChange?: (state: SceneLoadingEvent) => void;
}) {
  const { scene: sprayGun } = useGLTF(MODEL_PATH);
  const gunRef = useRef<THREE.Object3D>(null);
  const milloTextRef = useRef<THREE.Mesh>(null);
  const colorTextRef = useRef<THREE.Mesh>(null);

  const scale = useResponsiveScaling();
  const [milloColor, setMilloColor] = useState(new THREE.Color('#CCCCCC'));
  const [colorTextColor, setColorTextColor] = useState(new THREE.Color('#CCCCCC'));
  const [milloPosX, setMilloPosX] = useState(-1.0);
  const [colorPosX, setColorPosX] = useState(1.0);
  const [sprayActive, setSprayActive] = useState(false);
  const [sprayColor, setSprayColor] = useState<THREE.Color>(new THREE.Color('#314485'));
  const [animationReady, setAnimationReady] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [textGeometryReady, setTextGeometryReady] = useState(false);
  const hasReportedReady = useRef(false);
  const textReadyNotified = useRef(false);
  const animationStartNotified = useRef(false);
  const modelNotified = useRef(false);

  const notifyAnimationStarting = useCallback(() => {
    if (!animationStartNotified.current) {
      animationStartNotified.current = true;
      onSceneStateChange?.('animation-starting');
    }
  }, [onSceneStateChange]);


  // Optimized fontSize and spacing for better performance
  const fontSize = 0.8 * scale; // Further reduced for better performance
  const letterSpacing = 0.005 * scale; // Tighter spacing for optimization
  const charGap = letterSpacing * 1.6; // Reduced gap for compactness

  // Measure and center the text group after mount with null checks
  useEffect(() => {
    if (!textGeometryReady) return;

    const measureText = () => {
      try {
        if (!milloTextRef.current?.geometry || !colorTextRef.current?.geometry) {
          return;
        }

        const bboxMillo = milloTextRef.current.geometry.boundingBox;
        const bboxColor = colorTextRef.current.geometry.boundingBox;

        if (bboxMillo && bboxColor) {
          const widthMillo = bboxMillo.max.x - bboxMillo.min.x;
          const widthColor = bboxColor.max.x - bboxColor.min.x;
          const totalWidth = widthMillo + charGap + widthColor;
          setMilloPosX(-totalWidth / 2);
          setColorPosX(-totalWidth / 2 + widthMillo + charGap);
        }
      } catch (error) {
        console.warn('Text measurement failed, using default positions:', error);
        setMilloPosX(-1.0);
        setColorPosX(1.0);
      }
    };

    measureText();
    const timeout1 = setTimeout(measureText, 100);
    const timeout2 = setTimeout(measureText, 300);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [textGeometryReady, charGap, isMobile, fontSize]);

  // Enhanced animation initialization with better dependency tracking
  useEffect(() => {
    if (animationStartNotified.current) return;

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

      const allReady =
        milloMat &&
        colorMat &&
        gunObject &&
        milloGeom &&
        colorGeom &&
        modelLoaded &&
        textGeometryReady;

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
      if (!mounted || animationStartNotified.current) return;

      if (checkAllDependencies()) {
        console.log('🎉 All dependencies ready - starting animation!');
        notifyAnimationStarting();
        setAnimationReady(true);
        return;
      }

      retryCount++;
      if (retryCount < MAX_RETRIES) {
        checkInterval = setTimeout(startAnimationCheck, 25);
      } else {
        console.warn('⚠️ Max retries reached - forcing animation start');
        notifyAnimationStarting();
        setAnimationReady(true);
      }
    };

    const initialDelay = setTimeout(startAnimationCheck, 100);

    const absoluteFallback = setTimeout(() => {
      if (mounted && !animationStartNotified.current) {
        console.log('🚨 Absolute fallback - forcing animation start');
        notifyAnimationStarting();
        setAnimationReady(true);
      }
    }, 3000);

    return () => {
      mounted = false;
      clearTimeout(initialDelay);
      clearTimeout(checkInterval);
      clearTimeout(absoluteFallback);
    };
  }, [modelLoaded, textGeometryReady, notifyAnimationStarting]);

  useEffect(() => {
    if (!animationReady || hasReportedReady.current) return;
    hasReportedReady.current = true;
    onSceneReady();
  }, [animationReady, onSceneReady]);

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
  }, [animationReady, isMobile, milloPosX, colorPosX, fontSize, charGap]);

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
      setModelLoaded(true);
      if (!modelNotified.current) {
        modelNotified.current = true;
        onSceneStateChange?.('model-loaded');
      }

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
  }, [sprayGun, onSceneStateChange]);

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
          font={FONT_PATH}
          position={[milloPosX, 0, 0]}
          fontSize={fontSize}
          color={milloColor}
          anchorX="left"
          anchorY="middle"
          letterSpacing={letterSpacing}
          onSync={() => {
            console.log('📝 MILLO text geometry ready');
            if (colorTextRef.current?.geometry) {
              setTextGeometryReady((prev) => {
                if (!prev && !textReadyNotified.current) {
                  textReadyNotified.current = true;
                  onSceneStateChange?.('text-ready');
                }
                return true;
              });
            }
          }}
        >
          MILLO
        </Text>
        <Text
          ref={colorTextRef}
          font={FONT_PATH}
          position={[colorPosX, 0, 0]}
          fontSize={fontSize}
          color={colorTextColor}
          anchorX="left"
          anchorY="middle"
          letterSpacing={letterSpacing}
          onSync={() => {
            console.log('📝 COLOR text geometry ready');
            if (milloTextRef.current?.geometry) {
              setTextGeometryReady((prev) => {
                if (!prev && !textReadyNotified.current) {
                  textReadyNotified.current = true;
                  onSceneStateChange?.('text-ready');
                }
                return true;
              });
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

function LoadingOverlay({ progress, showStalledWarning }: { progress: number; showStalledWarning?: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-30 bg-gradient-to-br from-gray-900/80 to-black/80">
      <div className="text-center px-4 w-full max-w-2xl">
        <div className="mb-8 flex justify-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold">
            <span className="text-[#314485]">MILLO</span>
            <span className="text-[#C73834]">COLOR</span>
          </h1>
        </div>
        <div className="mb-8 mx-auto max-w-md">
          <div className="relative pt-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[#314485] bg-[#314485]/20">
                Loading 3D Experience
              </span>
              <span className="text-xs font-semibold inline-block text-[#C73834]">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-800">
              <div
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#314485] to-[#C73834] transition-all duration-300 ease-in-out"
                style={{ width: `${Math.min(100, Math.max(progress, 0))}%` }}
              />
            </div>
            {showStalledWarning && (
              <div className="text-center text-yellow-400 text-sm">
                Having trouble starting the animation. Showing fallback shortly…
              </div>
            )}
          </div>
        </div>
        <div className="relative h-24 mb-8 flex items-center justify-center">
          <div className="absolute w-3 h-3 rounded-full bg-[#314485] animate-ping opacity-75" />
          <div className="absolute w-3 h-3 rounded-full bg-[#314485] animate-pulse" />
          <div className="absolute flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-[#C73834] opacity-80"
                style={{
                  animation: `spray 1.5s infinite ${i * 0.2}s`,
                  transform: `translateX(${i * 10}px) translateY(${Math.sin(i) * 5}px)`
                }}
              />
            ))}
          </div>
        </div>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-400 font-light">
          Preparing your immersive experience…
        </p>
      </div>
    </div>
  );
}

function Hero3DFallback() {
  return (
    <section className="relative h-[80vh] w-full bg-transparent flex items-center justify-center overflow-hidden">
      <VideoBackground videoSrc="/videos/hero.mp4" className="z-0" />
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold mb-6">
          <span className="text-[#314485]">MILLO</span>
          <span className="text-[#C73834]">COLOR</span>
        </h1>
        <h2 className="font-montserrat font-bold text-white mb-6">
          <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">
            Spray Like a{' '}
            <TypewriterText strings={['Champion', 'Pro']} colors={['#314485', '#C73834']} className="inline-block font-montserrat" />
          </span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl">
          This device is viewing the optimized hero experience while we keep the same premium design and messaging.
        </p>
      </div>
    </section>
  );
}

// Simplified Hero3D component with resilient loading
function Hero3DClient() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [milestones, setMilestones] = useState({ model: false, text: false, animation: false });
  const [latestAssetProgress, setLatestAssetProgress] = useState(preloadProgress);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [showStalledWarning, setShowStalledWarning] = useState(false);
  const { active, progress, errors } = useProgress();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const supportsWebGL = isWebGLAvailable();
    setWebglSupported(supportsWebGL);

    if (!supportsWebGL) {
      console.warn('WebGL is not available on this device - falling back to static hero');
      setShowFallback(true);
      return;
    }

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMounted]);

  useEffect(() => {
    if (errors.length === 0) return;
    console.warn('Hero3D asset loading errors', errors);
    setShowFallback(true);
  }, [errors]);

  // Reset tracked progress whenever a new loading cycle begins
  useEffect(() => {
    if (active && progress === 0) {
      setLatestAssetProgress(0);
      setDisplayProgress(0);
      setMilestones({ model: false, text: false, animation: false });
      setShowStalledWarning(false);
    }
  }, [active, progress]);

  // Track the furthest asset progress reached so far in this session
  useEffect(() => {
    if (active && progress === 0) return;
    setLatestAssetProgress((prev) => Math.max(prev, progress, preloadProgress));
  }, [active, progress]);

  useEffect(() => {
    if (!webglSupported || sceneReady || showFallback) return;
    if (active) return;

    const timeout = window.setTimeout(() => {
      if (!sceneReady) {
        console.warn('Hero3D scene did not signal readiness in time - falling back');
        setShowFallback(true);
      }
    }, 8000);

    return () => window.clearTimeout(timeout);
  }, [active, sceneReady, webglSupported, showFallback]);

  const assetPortion = Math.min(latestAssetProgress, 100) * 0.6;
  let targetProgress = assetPortion;

  if (milestones.model) targetProgress = Math.max(targetProgress, 70);
  if (milestones.text) targetProgress = Math.max(targetProgress, 85);
  if (milestones.animation) targetProgress = Math.max(targetProgress, 95);
  if (sceneReady) targetProgress = 100;

  useEffect(() => {
    setDisplayProgress((prev) => (targetProgress < prev ? prev : targetProgress));
  }, [targetProgress]);

  const overlayProgress = sceneReady ? 100 : displayProgress;

  useEffect(() => {
    if (sceneReady) {
      setShowStalledWarning(false);
      return;
    }

    if (!active && overlayProgress >= 90) {
      const timer = window.setTimeout(() => setShowStalledWarning(true), 1500);
      return () => window.clearTimeout(timer);
    }

    setShowStalledWarning(false);
  }, [active, overlayProgress, sceneReady]);

  const handleSceneReady = useCallback(() => {
    setSceneReady(true);
  }, []);

  const handleSceneStateChange = useCallback((state: SceneLoadingEvent) => {
    setMilestones((prev) => {
      switch (state) {
        case 'model-loaded':
          if (prev.model) return prev;
          return { ...prev, model: true };
        case 'text-ready':
          if (prev.text) return prev;
          return { ...prev, text: true };
        case 'animation-starting':
          if (prev.animation) return prev;
          return { ...prev, animation: true };
        default:
          return prev;
      }
    });
  }, []);

  if (!isMounted) {
    return (
      <section className="relative h-[80vh] w-full bg-transparent flex items-center justify-center overflow-hidden">
        <VideoBackground videoSrc="/videos/hero.mp4" className="z-0" />
        <div className="text-center px-4 z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold mb-6 animate-pulse">
            <span className="text-[#314485]">MILLO</span>
            <span className="text-[#C73834]">COLOR</span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-400">Loading…</p>
        </div>
      </section>
    );
  }

  if (showFallback) {
    return <Hero3DFallback />;
  }

  const shouldShowOverlay = !sceneReady;

  return (
    <section className="relative h-[80vh] w-full bg-transparent overflow-hidden">
      <VideoBackground videoSrc="/videos/hero.mp4" className="z-0" />

      {shouldShowOverlay && (
        <LoadingOverlay progress={overlayProgress} showStalledWarning={showStalledWarning} />
      )}

      {sceneReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <div className="text-center px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold opacity-0">
              <span className="text-[#314485]">MILLO</span>
              <span className="text-[#C73834]">COLOR</span>
            </h1>
            <h2 className="font-montserrat font-bold text-white mt-24 sm:mt-28 md:mt-32 lg:mt-36 xl:mt-40 2xl:mt-44">
              <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">
                Spray Like a{' '}
                <TypewriterText strings={['Champion', 'Pro']} colors={['#314485', '#C73834']} className="inline-block font-montserrat" />
              </span>
            </h2>
          </div>
        </div>
      )}

      <CanvasRecommendedProps
        className="w-full h-full relative z-20"
        data-animation-active={sceneReady}
        camera={{ position: [0, 0, isMobile ? 4 : 6], fov: isMobile ? 70 : 55 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000', 0);
          console.log('✅ New WebGL context created successfully');
          const handleContextLost = (event: Event) => {
            event.preventDefault();
            console.warn('WebGL context lost - switching to fallback');
            setShowFallback(true);
          };
          gl.domElement.addEventListener('webglcontextlost', handleContextLost, { once: true });
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene
            isMobile={isMobile}
            onSceneReady={handleSceneReady}
            onSceneStateChange={handleSceneStateChange}
          />
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
