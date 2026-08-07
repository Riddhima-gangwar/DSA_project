import { SortResult, SortOrder, AnimationFrame } from './types';

export function selectionSort<T>(
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
    completedIndices: [...completedIndices],
    passNumber: 0,
    explanation: 'Starting Selection Sort. Finding the minimum/maximum element to place at the beginning.',
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      
      if (generateFrames) frames.push({
        array: [...arr],
        comparedIndices: [minIdx, j],
        swappedIndices: [],
        completedIndices: [...completedIndices],
        passNumber: i + 1,
        explanation: `Comparing current extremum at index ${minIdx} with element at index ${j}.`,
      });

      let condition = false;
      if (order === 'asc') {
        condition = arr[j][key] < arr[minIdx][key];
      } else {
        condition = arr[j][key] > arr[minIdx][key];
      }
      
      if (condition) {
        minIdx = j;
        if (generateFrames) frames.push({
          array: [...arr],
          comparedIndices: [minIdx],
          swappedIndices: [],
          completedIndices: [...completedIndices],
          passNumber: i + 1,
          explanation: `New extremum found at index ${minIdx}.`,
        });
      }
    }
    
    if (minIdx !== i) {
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
      swaps++;

      if (generateFrames) frames.push({
        array: [...arr],
        comparedIndices: [],
        swappedIndices: [i, minIdx],
        completedIndices: [...completedIndices],
        passNumber: i + 1,
        explanation: `Swapping element at index ${i} with found extremum at index ${minIdx}.`,
      });
    }

    completedIndices.push(i);
    if (generateFrames) frames.push({
      array: [...arr],
      comparedIndices: [],
      swappedIndices: [],
      completedIndices: [...completedIndices],
      passNumber: i + 1,
      explanation: `Pass ${i + 1} complete. Element at index ${i} is fully sorted.`,
    });
  }
  
  for (let i = 0; i < n; i++) {
    if (!completedIndices.includes(i)) completedIndices.push(i);
  }

  if (generateFrames) frames.push({
    array: [...arr],
    comparedIndices: [],
    swappedIndices: [],
    completedIndices: [...completedIndices],
    passNumber: n,
    explanation: 'Selection Sort complete.',
  });

  const end = performance.now();
  
  return {
    sortedArray: arr,
    frames,
    comparisons,
    swaps,
    executionTime: end - start,
    memoryUsage: n * 8,
  };
}
