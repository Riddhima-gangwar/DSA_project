export interface AnimationFrame<T> {
  array: T[]; // A snapshot of the array at this step
  comparedIndices: number[]; // Indices currently being compared
  swappedIndices: number[]; // Indices that were just swapped
  completedIndices: number[]; // Indices that are fully sorted
  passNumber: number; // Current pass/iteration
  explanation: string; // Explanatory text for Education Mode
}

export interface SortResult<T> {
  sortedArray: T[];
  frames: AnimationFrame<T>[];
  comparisons: number;
  swaps: number;
  executionTime: number; // in milliseconds
  memoryUsage?: number; // Simulated or estimated memory usage
}

export type SortAlgorithm = 'Bubble' | 'Selection' | 'Insertion' | 'Merge' | 'Quick';
export type SortOrder = 'asc' | 'desc';
