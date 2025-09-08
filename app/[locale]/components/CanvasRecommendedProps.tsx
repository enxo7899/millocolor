"use client";
import { Canvas, CanvasProps } from '@react-three/fiber';

export default function CanvasRecommendedProps({ children, ...rest }: CanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{
        powerPreference: 'high-performance',
        antialias: false,
        stencil: false,
        depth: true,
        alpha: true,
      }}
      {...rest}
    >
      {children}
    </Canvas>
  );
}