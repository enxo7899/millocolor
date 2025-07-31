import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface SprayParticlesProps {
  gunRef: React.RefObject<THREE.Object3D | null>;
  sprayActive: boolean;
  sprayColor: THREE.Color | string;
  scaleFactor: number;
  count?: number;
  spreadAngle?: number;   // cone angle in degrees
  speed?: number;         // base particle speed
  lifeTime?: number;      // base lifetime in seconds
  milloTextRef?: React.RefObject<any>; // Reference to Millo text for masking
  colorTextRef?: React.RefObject<any>; // Reference to Color text for masking
}

function SprayParticles({
  gunRef,
  sprayActive,
  sprayColor,
  scaleFactor,
  count = Math.floor(200 + 300 * scaleFactor), // Optimized particle count
  spreadAngle = 15 + (scaleFactor * 8), // Dynamic spread: 15-23° based on scale
  speed = 5,
  lifeTime = 0.8 // Slightly shorter lifetime for tighter spray
}: SprayParticlesProps) {
  const instancedRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Create mist texture for volumetric effect (client-side only)
  const [mistTexture, setMistTexture] = useState<THREE.Texture | null>(null);
  
  useEffect(() => {
    // Only create texture on client side to avoid SSR issues
    if (typeof window === 'undefined') return;
    
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    // Create soft, cloudy mist texture
    const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    gradient.addColorStop(0, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.3)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Add some noise for realistic mist
    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 0.3;
      data[i + 3] *= (1 - noise); // Reduce alpha randomly
    }
    ctx.putImageData(imageData, 0, 0);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    setMistTexture(texture);
    
    // Cleanup
    return () => {
      texture.dispose();
    };
  }, []);
  
  // Simple particle data for straightforward spray effect
  const particles = useMemo(() => {
    const temp: {
      age: number;
      life: number;
      triangularOffset: number; // For triangular spray pattern
    }[] = [];
    
    for (let i = 0; i < count; i++) {
      // Staggered start times for continuous flow
      const age = Math.random() * lifeTime;
      const life = lifeTime;
      
      // Triangular offset: 0 = center, 1 = max spread
      const triangularOffset = Math.random();
      
      temp.push({ 
        age, 
        life,
        triangularOffset
      });
    }
    return temp;
  }, [count, lifeTime]);
  
  // Refs to hold current spray state
  const sprayActiveRef = useRef(sprayActive);
  const currentColorRef = useRef<THREE.Color>(new THREE.Color(sprayColor));
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  
  // Update refs when props change - use useEffect for proper updates
  useEffect(() => { 
    sprayActiveRef.current = sprayActive; 
  }, [sprayActive]);
  
  useEffect(() => {
    const newColor = new THREE.Color();
    if (sprayColor instanceof THREE.Color) {
      newColor.copy(sprayColor);
    } else {
      newColor.set(sprayColor);
    }
    currentColorRef.current.copy(newColor);
    
    // Update material for natural mist (not harsh helicopter light)
    if (materialRef.current) {
      materialRef.current.color.copy(newColor);
      materialRef.current.transparent = true;
      materialRef.current.alphaTest = 0.05; // Softer edges
      materialRef.current.opacity = 0.25; // Much more transparent for realistic mist
    }
  }, [sprayColor]);

  // Get nozzle position 1cm closer to text from current position
  const getNozzleTransform = () => {
    if (!gunRef.current) return { position: new THREE.Vector3(), forward: new THREE.Vector3(0, 0, -1) };
    
    // Position spray correctly - right depth and move to the right
    const nozzleOffset = new THREE.Vector3(-1.2, 2.4, 0.3); // X kept at -1.2, moved right (Z: 0.5 -> 0.3)
    const nozzlePos = gunRef.current.localToWorld(nozzleOffset.clone());
    
    // Calculate target point that follows spraygun position (not always center)
    const gunWorldPos = gunRef.current.position;
    const targetPoint = new THREE.Vector3(gunWorldPos.x * 0.8, 0, 0); // X follows gun, Y=0 (text level), Z=0 (text plane)
    const towardTarget = targetPoint.clone().sub(nozzlePos).normalize();
    
    return { position: nozzlePos, forward: towardTarget };
  };

  useFrame((_, delta) => {
    const mesh = instancedRef.current;
    if (!mesh) return;
    
    // Get current nozzle position and direction
    const { position: nozzlePos, forward: nozzleForward } = getNozzleTransform();
    
    // Get current spray color for word masking
    const currentColor = currentColorRef.current;
    const isBlueSpray = currentColor.r < 0.4 && currentColor.g < 0.4 && currentColor.b > 0.6; // Blue for Millo
    const isRedSpray = currentColor.r > 0.6 && currentColor.g < 0.4 && currentColor.b < 0.4; // Red for Color
    
    // If not spraying, hide all particles immediately
    if (!sprayActiveRef.current) {
      particles.forEach((p, i) => {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      return;
    }
    
    particles.forEach((p, i) => {
      p.age += delta;
      
      // Reset particle when it expires
      if (p.age >= p.life) {
        p.age = 0;
      }
      
      // Calculate particle position along triangular spray path
      const progress = p.age / p.life; // 0 to 1
      const distance = progress * 2; // Max distance from nozzle
      
      // Calculate wider triangular spread for realistic spray pattern
      const triangularSpread = 40; // Much wider degrees for realistic spray
      const spreadX = Math.sin(triangularSpread * Math.PI / 180) * distance;
      const spreadY = Math.sin(triangularSpread * Math.PI / 180 * 0.6) * distance;
      
      // Spray direction toward title, but particles oriented vertically
      const sprayDirection = new THREE.Vector3(0, 0, -1); // Spray toward title
      
      // Create perpendicular vectors for triangular spread - rotated for vertical particles
      const rightVector = new THREE.Vector3(0, 1, 0); // Up direction becomes right
      const upVector = new THREE.Vector3(1, 0, 0); // Right direction becomes up
      
      // Start spray at nozzle position (already at furthest point toward text)
      const sprayStartPos = nozzlePos.clone(); // No additional offset needed
      
      // Position particle along spray direction toward text with triangular spread
      const particlePos = sprayStartPos.clone()
        .add(sprayDirection.clone().multiplyScalar(distance))
        .add(rightVector.clone().multiplyScalar(spreadX * (p.triangularOffset - 0.5) * 2.0))
        .add(upVector.clone().multiplyScalar(spreadY * (p.triangularOffset - 0.5) * 1.0));
      
      // DEBUG: Show all particles for now to ensure spray is working
      let particleVisible = true; // Always show particles for debugging
      
      // Position the particle
      dummy.position.copy(particlePos);
      
      // Scale particle: consistent spray with no balls/spitting effect
      const baseScale = 0.25 + distance * 0.5; // Consistent scaling
      const fadeScale = progress < 0.95 ? 1 : (1 - (progress - 0.95) / 0.05); // Very minimal fading
      const finalScale = particleVisible ? baseScale * fadeScale : 0;
      
      // Enhanced particle scaling to maintain proportional relationship with text across all devices
      // On mobile, scaleFactor is smaller (0.4-0.65) vs desktop (1.3-2.5)
      // Boost mobile particle scaling to maintain visual proportion with text
      const particleScalingBoost = scaleFactor < 0.8 ? 1.5 : 1.0; // 50% boost for mobile
      dummy.scale.setScalar(finalScale * 0.6 * scaleFactor * particleScalingBoost);
      
      // Rotate particles to be vertical as requested
      dummy.rotation.z = Math.PI / 2; // Rotate 90 degrees to make vertical
      
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    
    mesh.instanceMatrix.needsUpdate = true;
  });

  // Don't render until texture is loaded to avoid SSR issues
  if (!mistTexture) return null;
  
  // Only show mist when actively spraying to prevent lingering
  if (!sprayActiveRef.current) return null;
  
  // Word-specific masking implemented - particles only show over target word area
  
  // Render triangular volumetric mist spray using instancedMesh
  return (
    <instancedMesh ref={instancedRef} args={[undefined, undefined, count]} frustumCulled={false}>
      {/* Use planes for volumetric mist effect */}
      <planeGeometry args={[1, 1]} /> 
      <meshBasicMaterial 
        ref={materialRef}
        map={mistTexture}
        color={currentColorRef.current}
        transparent 
        opacity={0.25} // More transparent to see underlying content
        depthWrite={false}
        blending={THREE.NormalBlending} // Normal blending for better color accuracy
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}

export default SprayParticles; 