"use client";

import { useEffect, useRef, useState } from 'react';

interface VideoBackgroundProps {
  videoSrc: string;
  className?: string;
}

export default function VideoBackground({ videoSrc, className = "" }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
    };

    const handleCanPlay = () => {
      setIsPlaying(true);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      // Loop the video
      video.currentTime = 0;
      video.play().catch(console.error);
    };

    // Add event listeners
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    // Start playing when ready
    const playVideo = async () => {
      try {
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.autoplay = true;
        // Slow down the video playback rate to match animation timing
        video.playbackRate = 0.5; // 50% slower
        
        // Add a small delay to better sync with the 3D animation
        setTimeout(async () => {
          await video.play();
        }, 1000); // 1 second delay
      } catch (error) {
        console.warn('Video autoplay failed:', error);
        // Fallback: try to play on user interaction
        const handleUserInteraction = () => {
          video.play().catch(console.error);
          document.removeEventListener('click', handleUserInteraction);
          document.removeEventListener('touchstart', handleUserInteraction);
        };
        document.addEventListener('click', handleUserInteraction);
        document.addEventListener('touchstart', handleUserInteraction);
      }
    };

    playVideo();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none video-background-container ${className}`}>
      <video
        ref={videoRef}
        className="video-background opacity-50"
        playsInline
        muted
        loop
        autoPlay
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Fallback overlay for better contrast */}
      <div 
        className="absolute inset-0 bg-black/20"
        style={{ zIndex: -1 }}
      />
    </div>
  );
} 