export interface SearchAnimationFrame<T> {
  array: T[];
  currentIndex: number;
  lowPointer?: number;
  midPointer?: number;
  highPointer?: number;
  searchRange?: [number, number];
  discardedIndices: number[]; // Indices that have been eliminated from search space
  found: boolean;
  explanation: string;
  comparisons: number; // To show real-time comparison updates
}

export interface SearchResult<T> {
  item: T | null;
  index: number;
  comparisons: number;
  executionTime: number;
  frames: SearchAnimationFrame<T>[];
}
