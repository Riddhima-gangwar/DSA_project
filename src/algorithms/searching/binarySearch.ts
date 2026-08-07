import type { SearchResult, SearchAnimationFrame } from './types';
import { quickSort } from '../sorting/quickSort';

export function binarySearch<T>(
  array: T[],
  key: keyof T,
  target: any,
  generateFrames: boolean = true
): { searchResult: SearchResult<T>, sortedArray: T[] } {
  const start = performance.now();
  let comparisons = 0;
  const frames: SearchAnimationFrame<T>[] = [];
  const discardedIndices: number[] = [];

  // Create a sorted copy before searching. Never modify the original dataset.
  const sortedCopy = [...array];
  // We use our own quickSort to sort it. Note: quickSort handles its own frames, we ignore them here.
  const { sortedArray } = quickSort(sortedCopy, key, 'asc', false);

  if (generateFrames) {
    frames.push({
      array: [...sortedArray],
      currentIndex: -1,
      searchRange: [0, sortedArray.length - 1],
      discardedIndices: [],
      found: false,
      explanation: `Dataset sorted. Starting Binary Search for target "${target}".`,
      comparisons: 0
    });
  }

  let low = 0;
  let high = sortedArray.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const val = sortedArray[mid][key];

    if (generateFrames) {
      frames.push({
        array: [...sortedArray],
        currentIndex: mid,
        lowPointer: low,
        midPointer: mid,
        highPointer: high,
        searchRange: [low, high],
        discardedIndices: [...discardedIndices],
        found: false,
        explanation: `Calculating mid index: floor((${low} + ${high}) / 2) = ${mid}. Checking value ${val}.`,
        comparisons
      });
    }

    comparisons++;
    let isMatch = false;
    let isGreater = false;

    if (typeof val === 'string' && typeof target === 'string') {
      isMatch = val.toLowerCase() === target.toLowerCase();
      isGreater = val.toLowerCase() > target.toLowerCase();
    } else {
      isMatch = Number(val) === Number(target);
      isGreater = Number(val) > Number(target);
    }

    if (isMatch) {
      if (generateFrames) {
        frames.push({
          array: [...sortedArray],
          currentIndex: mid,
          lowPointer: low,
          midPointer: mid,
          highPointer: high,
          searchRange: [low, high],
          discardedIndices: [...discardedIndices],
          found: true,
          explanation: `Target found in green at index ${mid}!`,
          comparisons
        });
      }
      const end = performance.now();
      return {
        searchResult: {
          item: sortedArray[mid],
          index: mid,
          comparisons,
          executionTime: end - start,
          frames,
        },
        sortedArray
      };
    }

    // Determine discarded halves
    if (isGreater) {
      // Discard right half including mid
      for (let i = mid; i <= high; i++) {
        if (!discardedIndices.includes(i)) discardedIndices.push(i);
      }
      if (generateFrames) {
        frames.push({
          array: [...sortedArray],
          currentIndex: mid,
          lowPointer: low,
          midPointer: mid,
          highPointer: high,
          searchRange: [low, high],
          discardedIndices: [...discardedIndices],
          found: false,
          explanation: `Value ${val} is greater than ${target}. Discarding right half.`,
          comparisons
        });
      }
      high = mid - 1;
    } else {
      // Discard left half including mid
      for (let i = low; i <= mid; i++) {
        if (!discardedIndices.includes(i)) discardedIndices.push(i);
      }
      if (generateFrames) {
        frames.push({
          array: [...sortedArray],
          currentIndex: mid,
          lowPointer: low,
          midPointer: mid,
          highPointer: high,
          searchRange: [low, high],
          discardedIndices: [...discardedIndices],
          found: false,
          explanation: `Value ${val} is less than ${target}. Discarding left half.`,
          comparisons
        });
      }
      low = mid + 1;
    }
  }

  // If we reach here, it wasn't found
  if (generateFrames) {
    frames.push({
      array: [...sortedArray],
      currentIndex: -1,
      searchRange: [0, 0],
      discardedIndices: [...discardedIndices],
      found: false,
      explanation: 'Search space exhausted. Resource Not Found.',
      comparisons
    });
  }

  const end = performance.now();
  return {
    searchResult: {
      item: null,
      index: -1,
      comparisons,
      executionTime: end - start,
      frames,
    },
    sortedArray
  };
}
