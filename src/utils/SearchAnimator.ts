import { useState, useEffect, useRef, useCallback } from 'react';
import { SearchAnimationFrame } from '../algorithms/searching/types';

export function useSearchAnimator<T>(initialSpeed: number = 150) {
  const [frames, setFrames] = useState<SearchAnimationFrame<T>[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentFrame = frames[currentFrameIndex] || null;
  const isFinished = frames.length > 0 && currentFrameIndex === frames.length - 1;

  const play = useCallback(() => {
    if (frames.length > 0 && !isFinished) {
      setIsPlaying(true);
    }
  }, [frames.length, isFinished]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setFrames([]);
    setCurrentFrameIndex(0);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const stepForward = useCallback(() => {
    if (currentFrameIndex < frames.length - 1) {
      setCurrentFrameIndex(prev => prev + 1);
    }
  }, [currentFrameIndex, frames.length]);

  const stepBackward = useCallback(() => {
    if (currentFrameIndex > 0) {
      setCurrentFrameIndex(prev => prev - 1);
    }
  }, [currentFrameIndex]);

  // Load new frames from a search execution
  const loadFrames = useCallback((newFrames: SearchAnimationFrame<T>[]) => {
    reset();
    setFrames(newFrames);
    if (newFrames.length > 0) {
      setIsPlaying(true);
    }
  }, [reset]);

  // Handle the async animation loop
  useEffect(() => {
    if (isPlaying && !isFinished) {
      const delay = Math.max(50, 500 - speed); // Invert speed slider value
      timerRef.current = setTimeout(() => {
        stepForward();
      }, delay);
    } else if (isFinished) {
      setIsPlaying(false);
    }

    // Crucial: cancel timers on unmount or dependency change
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentFrameIndex, speed, isFinished, stepForward]);

  return {
    frames,
    currentFrame,
    currentFrameIndex,
    isPlaying,
    isFinished,
    speed,
    setSpeed,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    loadFrames
  };
}
