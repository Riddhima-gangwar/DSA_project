import type { SearchResult, SearchAnimationFrame } from './types';

export function linearSearch<T>(
  array: T[],
  key: keyof T,
  target: any,
  generateFrames: boolean = true
): SearchResult<T> {
  const start = performance.now();
  let comparisons = 0;
  const frames: SearchAnimationFrame<T>[] = [];
  const discardedIndices: number[] = [];

  if (generateFrames) {
    frames.push({
      array: [...array],
      currentIndex: -1,
      searchRange: [0, array.length - 1],
      discardedIndices: [],
      found: false,
      explanation: `Starting Linear Search for target quantity "${target}".`,
      comparisons: 0
    });
  }

  for (let i = 0; i < array.length; i++) {
    const val = array[i][key];
    
    if (generateFrames) {
      frames.push({
        array: [...array],
        currentIndex: i,
        searchRange: [i, array.length - 1],
        discardedIndices: [...discardedIndices],
        found: false,
        explanation: `Checking index ${i}. Value is ${val}. Target is ${target}.`,
        comparisons
      });
    }

    comparisons++;

    // Explicit manual comparison per requirement
    let isMatch = false;
    if (typeof val === 'string' && typeof target === 'string') {
      isMatch = val.toLowerCase() === target.toLowerCase();
    } else {
      isMatch = Number(val) === Number(target);
    }

    if (isMatch) {
      if (generateFrames) {
        frames.push({
          array: [...array],
          currentIndex: i,
          searchRange: [i, array.length - 1],
          discardedIndices: [...discardedIndices],
          found: true,
          explanation: `Target found at index ${i}!`,
          comparisons
        });
      }
      const end = performance.now();
      return {
        item: array[i],
        index: i,
        comparisons,
        executionTime: end - start,
        frames,
      };
    } else {
      discardedIndices.push(i);
      if (generateFrames) {
        frames.push({
          array: [...array],
          currentIndex: i,
          searchRange: [i + 1, array.length - 1],
          discardedIndices: [...discardedIndices],
          found: false,
          explanation: `Value ${val} is not the target. Moving to next element.`,
          comparisons
        });
      }
    }
  }

  if (generateFrames) {
    frames.push({
      array: [...array],
      currentIndex: -1,
      searchRange: [array.length, array.length],
      discardedIndices: [...discardedIndices],
      found: false,
      explanation: 'Reached end of array. Resource Not Found.',
      comparisons
    });
  }

  const end = performance.now();
  return {
    item: null,
    index: -1,
    comparisons,
    executionTime: end - start,
    frames,
  };
}
