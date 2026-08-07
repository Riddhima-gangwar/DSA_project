import { SortResult, SortOrder, AnimationFrame } from './types';

export function mergeSort<T>(
  array: T[],
  key: keyof T,
  order: SortOrder = 'asc', generateFrames: boolean = true
): SortResult<T> {
  const start = performance.now();
  let comparisons = 0;
  let swaps = 0; 

  const arr = [...array];
  const n = arr.length;
  const frames: AnimationFrame<T>[] = [];
  const completedIndices: number[] = [];
  
  if (generateFrames) frames.push({
    array: [...arr],
    comparedIndices: [],
    swappedIndices: [],
    completedIndices: [],
    passNumber: 0,
    explanation: 'Starting Merge Sort. Recursively dividing array into halves.',
  });

  function merge(low: number, mid: number, high: number) {
    let left = arr.slice(low, mid + 1);
    let right = arr.slice(mid + 1, high + 1);
    
    let i = 0, j = 0, k = low;
    
    while (i < left.length && j < right.length) {
      comparisons++;
      
      if (generateFrames) frames.push({
        array: [...arr],
        comparedIndices: [low + i, mid + 1 + j],
        swappedIndices: [],
        completedIndices: [...completedIndices],
        passNumber: k, // Using k just as a progressing indicator
        explanation: `Comparing elements from left sub-array and right sub-array for merge.`,
      });

      let condition = false;
      if (order === 'asc') {
        condition = left[i][key] <= right[j][key];
      } else {
        condition = left[i][key] >= right[j][key];
      }

      if (condition) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }
      
      swaps++; // Treating write as a swap operation for tracking
      if (generateFrames) frames.push({
        array: [...arr],
        comparedIndices: [],
        swappedIndices: [k],
        completedIndices: [...completedIndices],
        passNumber: k,
        explanation: `Writing selected element into the merged array at index ${k}.`,
      });
      k++;
    }
    
    while (i < left.length) {
      arr[k] = left[i];
      swaps++;
      if (generateFrames) frames.push({
        array: [...arr],
        comparedIndices: [],
        swappedIndices: [k],
        completedIndices: [...completedIndices],
        passNumber: k,
        explanation: `Writing remaining element from left sub-array at index ${k}.`,
      });
      i++;
      k++;
    }
    
    while (j < right.length) {
      arr[k] = right[j];
      swaps++;
      if (generateFrames) frames.push({
        array: [...arr],
        comparedIndices: [],
        swappedIndices: [k],
        completedIndices: [...completedIndices],
        passNumber: k,
        explanation: `Writing remaining element from right sub-array at index ${k}.`,
      });
      j++;
      k++;
    }
    
    // Once merged, this segment is sorted relative to itself
    for (let x = low; x <= high; x++) {
      if (!completedIndices.includes(x)) completedIndices.push(x);
    }
    if (generateFrames) frames.push({
      array: [...arr],
      comparedIndices: [],
      swappedIndices: [],
      completedIndices: [...completedIndices],
      passNumber: k,
      explanation: `Merge complete for range [${low} - ${high}].`,
    });
  }

  function mergeSortRec(low: number, high: number) {
    if (low < high) {
      const mid = Math.floor((low + high) / 2);
      mergeSortRec(low, mid);
      mergeSortRec(mid + 1, high);
      merge(low, mid, high);
    }
  }

  mergeSortRec(0, n - 1);
  
  // Ensure all are completed
  for (let i = 0; i < n; i++) {
    if (!completedIndices.includes(i)) completedIndices.push(i);
  }

  if (generateFrames) frames.push({
    array: [...arr],
    comparedIndices: [],
    swappedIndices: [],
    completedIndices: [...completedIndices],
    passNumber: n,
    explanation: 'Merge Sort complete.',
  });

  const end = performance.now();

  return {
    sortedArray: arr,
    frames,
    comparisons,
    swaps, 
    executionTime: end - start,
    memoryUsage: n * 8 * 2, // Extra space required for arrays
  };
}
