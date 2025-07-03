"use client";

import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Loader, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function Model({ modelPath, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0] }: { 
  modelPath: string; 
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null);

  // Auto rotation effect
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005;
    }
  });

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={scale} 
      position={position}
      rotation={rotation}
    />
  );
}

// Camera controller that adjusts to fit model
function CameraController() {
  const { camera, scene } = useThree();
  
  useEffect(() => {
    // Set initial camera position
    camera.position.set(0, 1, 5);
    camera.lookAt(0, 0, 0);
    
    // Optional: If you want to auto-fit the camera to the scene
    // This is a simple implementation, you might need to adjust based on your model
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    // Adjust camera position based on model size
    camera.position.copy(center);
    camera.position.z += size;
    camera.lookAt(center);
    
  }, [camera, scene]);
  
  return null;
}

export default function ModelViewer({ 
  modelPath = '/models/millocolor-model.glb',
  backgroundColor = '#f5f5f5',
  autoRotate = true,
  enableZoom = true,
  enablePan = false,
  intensity = 0.5
}: {
  modelPath?: string;
  backgroundColor?: string;
  autoRotate?: boolean;
  enableZoom?: boolean;
  enablePan?: boolean;
  intensity?: number;
}) {
  const [isClient, setIsClient] = useState(false);
  
  // Prevent hydration issues by only rendering on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-pulse">Loading 3D viewer...</div>
      </div>
    );
  }
  
  return (
    <>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
        style={{ 
          width: '100%', 
          height: '100%', 
          background: backgroundColor,
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        {/* Camera and lighting setup */}
        <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={45} />
        <CameraController />
        <ambientLight intensity={intensity} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={intensity * 2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={intensity} />
        
        {/* Model */}
        <Model modelPath={modelPath} />
        
        {/* Environment and controls */}
        <Environment preset="city" />
        <OrbitControls 
          autoRotate={autoRotate}
          autoRotateSpeed={1}
          enableZoom={enableZoom}
          enablePan={enablePan}
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>
      <Loader />
    </>
  );
}
