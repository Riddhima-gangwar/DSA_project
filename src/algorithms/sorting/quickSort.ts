import { SortResult, SortOrder, AnimationFrame } from './types';

export function quickSort<T>(
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
    explanation: 'Starting Quick Sort. Partitioning arrays around a pivot.',
  });

  function partition(low: number, high: number): number {
    const pivot = arr[high];
    let i = low - 1;
    
    if (generateFrames) frames.push({
      array: [...arr],
      comparedIndices: [high],
      swappedIndices: [],
      completedIndices: [...completedIndices],
      passNumber: low,
      explanation: `Selected element at index ${high} as pivot.`,
    });

    for (let j = low; j < high; j++) {
      comparisons++;
      if (generateFrames) frames.push({
        array: [...arr],
        comparedIndices: [j, high],
        swappedIndices: [],
        completedIndices: [...completedIndices],
        passNumber: j,
        explanation: `Comparing element at index ${j} with pivot.`,
      });

      let condition = false;
      if (order === 'asc') {
        condition = arr[j][key] < pivot[key];
      } else {
        condition = arr[j][key] > pivot[key];
      }

      if (condition) {
        i++;
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        swaps++;
        
        if (generateFrames) frames.push({
          array: [...arr],
          comparedIndices: [],
          swappedIndices: [i, j],
          completedIndices: [...completedIndices],
          passNumber: j,
          explanation: `Condition met. Swapped elements at index ${i} and ${j}.`,
        });
      }
    }
    
    const temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    swaps++;
    
    completedIndices.push(i + 1);
    
    if (generateFrames) frames.push({
      array: [...arr],
      comparedIndices: [],
      swappedIndices: [i + 1, high],
      completedIndices: [...completedIndices],
      passNumber: high,
      explanation: `Swapped pivot to its correct sorted position at index ${i + 1}.`,
    });
    
    return i + 1;
  }

  function quickSortRec(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      quickSortRec(low, pi - 1);
      quickSortRec(pi + 1, high);
    } else if (low === high) {
      if (!completedIndices.includes(low)) completedIndices.push(low);
      if (generateFrames) frames.push({
        array: [...arr],
        comparedIndices: [],
        swappedIndices: [],
        completedIndices: [...completedIndices],
        passNumber: low,
        explanation: `Sub-array of size 1 is trivially sorted at index ${low}.`,
      });
    }
  }

  quickSortRec(0, n - 1);
  
  for (let i = 0; i < n; i++) {
    if (!completedIndices.includes(i)) completedIndices.push(i);
  }

  if (generateFrames) frames.push({
    array: [...arr],
    comparedIndices: [],
    swappedIndices: [],
    completedIndices: [...completedIndices],
    passNumber: n,
    explanation: 'Quick Sort complete.',
  });

  const end = performance.now();

  return {
    sortedArray: arr,
    frames,
    comparisons,
    swaps,
    executionTime: end - start,
    memoryUsage: n * 8, // Roughly
  };
}
