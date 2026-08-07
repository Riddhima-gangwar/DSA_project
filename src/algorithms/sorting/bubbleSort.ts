import { SortResult, SortOrder, AnimationFrame } from './types';

export function bubbleSort<T>(
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
    explanation: 'Starting Bubble Sort. Preparing to bubble largest/smallest elements to the end.',
  });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      
      if (generateFrames) frames.push({
        array: [...arr],
        comparedIndices: [j, j + 1],
        swappedIndices: [],
        completedIndices: [...completedIndices],
        passNumber: i + 1,
        explanation: `Comparing indices ${j} and ${j + 1}.`,
      });

      let condition = false;
      if (order === 'asc') {
        condition = arr[j][key] > arr[j + 1][key];
      } else {
        condition = arr[j][key] < arr[j + 1][key];
      }

      if (condition) {
        // Swap
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swaps++;
        swapped = true;

        if (generateFrames) frames.push({
          array: [...arr],
          comparedIndices: [],
          swappedIndices: [j, j + 1],
          completedIndices: [...completedIndices],
          passNumber: i + 1,
          explanation: `Condition met. Swapped indices ${j} and ${j + 1}.`,
        });
      }
    }
    
    // The element at n - i - 1 is now in its correct sorted position
    completedIndices.push(n - i - 1);
    if (generateFrames) frames.push({
      array: [...arr],
      comparedIndices: [],
      swappedIndices: [],
      completedIndices: [...completedIndices],
      passNumber: i + 1,
      explanation: `Pass ${i + 1} complete. Element at index ${n - i - 1} is fully sorted.`,
    });

    if (!swapped) {
      if (generateFrames) frames.push({
        array: [...arr],
        comparedIndices: [],
        swappedIndices: [],
        completedIndices: [...completedIndices],
        passNumber: i + 1,
        explanation: `No swaps occurred during pass ${i + 1}. The array is fully sorted. Early exit.`,
      });
      break;
    }
  }
  
  // Mark any remaining elements as completed
  for (let i = 0; i < n; i++) {
    if (!completedIndices.includes(i)) completedIndices.push(i);
  }
  
  if (generateFrames) frames.push({
    array: [...arr],
    comparedIndices: [],
    swappedIndices: [],
    completedIndices: [...completedIndices],
    passNumber: n,
    explanation: 'Bubble Sort complete.',
  });
  
  const end = performance.now();
  
  return {
    sortedArray: arr,
    frames,
    comparisons,
    swaps,
    executionTime: end - start,
    memoryUsage: n * 8, // simple mockup
  };
}
