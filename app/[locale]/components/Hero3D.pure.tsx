"use client";

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import React from 'react';

// Error boundary for Three.js rendering errors
class ErrorBoundary extends React.Component<{ children: React.ReactNode, fallback: React.ReactNode }> {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error in Three.js rendering:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Fallback UI for when Three.js fails to render
const FallbackErrorUI = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="text-center p-4">
      <h2 className="text-2xl font-bold text-red-500 mb-2">3D Rendering Error</h2>
      <p className="mb-4">We encountered an issue loading the 3D content.</p>
      <div className="mt-6">
        <h1 className="text-4xl font-bold text-gray-900">
          <span className="text-millo-blue">Millo</span>
          <span className="text-millo-red">Color</span>
        </h1>
        <p className="text-xl text-gray-600 mt-2">Spray Like a Champion</p>
      </div>
    </div>
  </div>
);

// Helper function to detect WebGL support
function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

const Hero3D = () => {
  const t = useTranslations('hero');
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Scene objects
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sprayGunRef = useRef<THREE.Object3D | null>(null);
  const animationRef = useRef<number | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  
  // Mouse tracking for parallax effect
  const mousePosition = useRef({ x: 0, y: 0 });
  
  // Clean up function to prevent memory leaks
  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    setIsClient(true);
    
    // Check for WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl', { powerPreference: 'high-performance' }) || 
                canvas.getContext('experimental-webgl');
      
      if (!gl) {
        setHasWebGL(false);
        setErrorMessage('WebGL not supported by your browser');
        return;
      }
      
      // Clean up context
      const webglContext = gl as WebGLRenderingContext;
      if (webglContext.getExtension && webglContext.getExtension('WEBGL_lose_context')) {
        webglContext.getExtension('WEBGL_lose_context')?.loseContext();
      }
    } catch (e) {
      console.error('WebGL detection error:', e);
      setHasWebGL(false);
      setErrorMessage('Error detecting WebGL support');
      return;
    }
    
    // If no container or WebGL not supported, exit early
    if (!containerRef.current || !hasWebGL) return;
    
    const container = containerRef.current;
    
    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      45, 
      container.clientWidth / container.clientHeight, 
      0.1, 
      1000
    );
    camera.position.set(0, 0, 8);
    cameraRef.current = camera;
    
    // Setup renderer with antialiasing and transparency
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance' 
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0xffffff, 0); // Transparent background
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Load spray gun model
    const loader = new GLTFLoader();
    loader.load(
      '/models/spray_gun.glb',
      (gltf) => {
        const model = gltf.scene;
        model.position.set(-2, 0, 0);
        model.scale.set(1, 1, 1);
        scene.add(model);
        sprayGunRef.current = model;
        
        // Text setup
        setupText();
        
        // Start animation after model is loaded
        setupAnimation();
        
        // Mark as loaded
        setIsLoaded(true);
      },
      (progress) => {
        console.log(`Loading model: ${(progress.loaded / progress.total * 100)}%`);
      },
      (error) => {
        console.error('Error loading model:', error);
        setErrorMessage('Failed to load 3D model');
      }
    );
    
    // Add text for "MilloColor" brand
    function setupText() {
      // Create "Millo" in blue
      const milloMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 1),
        new THREE.MeshBasicMaterial({ 
          color: 0x004a99, // Blue
          transparent: true,
          opacity: 0,
        })
      );
      milloMesh.position.set(0, 0.5, 0);
      scene.add(milloMesh);
      milloMesh.name = "milloText";
      
      // Create "Color" in red
      const colorMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 1),
        new THREE.MeshBasicMaterial({ 
          color: 0xe30613, // Red
          transparent: true,
          opacity: 0,
        })
      );
      colorMesh.position.set(2, 0.5, 0);
      scene.add(colorMesh);
      colorMesh.name = "colorText";
    }
    
    // Handle window resize
    function handleResize() {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const container = containerRef.current;
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    }
    
    // Setup mouse move tracking for parallax effect
    function setupMouseTracking() {
      const handleMouseMove = (event: MouseEvent) => {
        mousePosition.current = {
          x: (event.clientX / window.innerWidth) * 2 - 1,
          y: -(event.clientY / window.innerHeight) * 2 + 1
        };
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
    
    // Animation setup
    function setupAnimation() {
      if (!sprayGunRef.current) return;
      
      const sprayGun = sprayGunRef.current;
      const milloText = scene.getObjectByName("milloText");
      const colorText = scene.getObjectByName("colorText");
      
      if (!milloText || !colorText) return;
      
      // Create GSAP timeline
      const tl = gsap.timeline({ 
        repeat: -1,
        repeatDelay: 1
      });
      timelineRef.current = tl;
      
      // Animate spray gun to first position (Millo)
      tl.to(sprayGun.position, {
        x: -2, 
        y: 0.5, 
        z: 1,
        duration: 1,
        ease: "power2.inOut"
      });
      
      // Spray Millo text
      tl.to(milloText.material, {
        opacity: 1,
        duration: 1.5,
        ease: "power1.in"
      }, "-=0.5");
      
      // Move to Color position
      tl.to(sprayGun.position, {
        x: 2, 
        y: 0.5, 
        z: 1,
        duration: 1,
        ease: "power2.inOut"
      });
      
      // Spray Color text
      tl.to(colorText.material, {
        opacity: 1,
        duration: 1.5,
        ease: "power1.in"
      }, "-=0.5");
      
      // Move gun back to starting position
      tl.to(sprayGun.position, {
        x: -2, 
        y: 0, 
        z: 0,
        duration: 1.5,
        ease: "power2.inOut"
      });
      
      // Fade out text for next loop
      tl.to([milloText.material, colorText.material], {
        opacity: 0,
        duration: 1,
        ease: "power1.out"
      }, "-=0.5");
    }
    
    // Animation loop function
    function animate() {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      
      // Apply subtle parallax movement to camera
      if (sprayGunRef.current) {
        const { x, y } = mousePosition.current;
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, x * 0.5, 0.05);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, y * 0.5, 0.05);
        camera.lookAt(scene.position);
      }
      
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    }
    
    // Set up resize handler
    window.addEventListener('resize', handleResize);
    
    // Set up mouse tracking
    const cleanupMouseTracking = setupMouseTracking();
    
    // Start animation loop
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cleanupMouseTracking();
      
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // Dispose of all Three.js resources
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      // Remove all event listeners
      if (container) {
        const canvas = container.querySelector('canvas');
        if (canvas) {
          container.removeChild(canvas);
        }
      }
    };
  }, [hasWebGL]);
  
  if (!isClient) {
    // SSR placeholder
    return (
      <section className="relative h-[80vh] bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">MilloColor</h1>
          <p className="text-xl mb-6">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[80vh] bg-white">
      {hasWebGL && isLoaded ? (
        <div id="hero3d-canvas-container" className="w-full h-full" ref={containerRef}>
          {/* Three.js will render here */}
        </div>
      ) : (
        // Fallback for no WebGL support or loading state
        <div className="w-full h-full flex items-center justify-center">
          {!isLoaded ? (
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-millo-red border-r-transparent align-[-0.125em]"></div>
              <p className="mt-4 text-gray-600">Loading 3D Scene...</p>
            </div>
          ) : (
            <div className="text-center">
              {errorMessage && (
                <p className="text-red-500 mb-4">Error: {errorMessage}</p>
              )}
              <h1 className="text-4xl font-bold text-gray-900">
                <span className="text-millo-blue">Millo</span>
                <span className="text-millo-red">Color</span>
              </h1>
              <p className="text-xl text-gray-600 mt-2">Spray Like a Champion</p>
            </div>
          )}
        </div>
      )}
      
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
};

export default Hero3D;
