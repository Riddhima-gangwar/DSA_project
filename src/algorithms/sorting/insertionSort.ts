import { SortResult, SortOrder, AnimationFrame } from './types';

export function insertionSort<T>(
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
  const completedIndices: number[] = [0]; // The first element is trivially sorted
  
  if (generateFrames) frames.push({
    array: [...arr],
    comparedIndices: [],
    swappedIndices: [],
    completedIndices: [...completedIndices],
    passNumber: 0,
    explanation: 'Starting Insertion Sort. The first element is considered sorted. We will insert subsequent elements into the sorted portion.',
  });

  for (let i = 1; i < n; i++) {
    let keyItem = arr[i];
    let j = i - 1;
    
    if (generateFrames) frames.push({
      array: [...arr],
      comparedIndices: [i],
      swappedIndices: [],
      completedIndices: [...completedIndices],
      passNumber: i,
      explanation: `Selected element at index ${i} to insert into the sorted portion.`,
    });

    let condition = false;
    
    while (j >= 0) {
      comparisons++;
      
      if (generateFrames) frames.push({
        array: [...arr],
        comparedIndices: [j, j + 1], // Comparing with the position where it might go
        swappedIndices: [],
        completedIndices: [...completedIndices],
        passNumber: i,
        explanation: `Comparing inserted element with sorted element at index ${j}.`,
      });

      if (order === 'asc') {
        condition = arr[j][key] > keyItem[key];
      } else {
        condition = arr[j][key] < keyItem[key];
      }
      
      if (condition) {
        arr[j + 1] = arr[j];
        swaps++;
        
        if (generateFrames) frames.push({
          array: [...arr],
          comparedIndices: [],
          swappedIndices: [j, j + 1],
          completedIndices: [...completedIndices],
          passNumber: i,
          explanation: `Element at index ${j} is shifted to ${j + 1}.`,
        });
        
        j = j - 1;
      } else {
        if (generateFrames) frames.push({
          array: [...arr],
          comparedIndices: [],
          swappedIndices: [],
          completedIndices: [...completedIndices],
          passNumber: i,
          explanation: `Correct position found. Element belongs after index ${j}.`,
        });
        break;
      }
    }
    
    arr[j + 1] = keyItem;
    if (!completedIndices.includes(i)) completedIndices.push(i);
    
    if (generateFrames) frames.push({
      array: [...arr],
      comparedIndices: [],
      swappedIndices: [j + 1],
      completedIndices: [...completedIndices],
      passNumber: i,
      explanation: `Element inserted at index ${j + 1}. Pass ${i} complete.`,
    });
  }
  
  if (generateFrames) frames.push({
    array: [...arr],
    comparedIndices: [],
    swappedIndices: [],
    completedIndices: [...completedIndices],
    passNumber: n,
    explanation: 'Insertion Sort complete.',
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
