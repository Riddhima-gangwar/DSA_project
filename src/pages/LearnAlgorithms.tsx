import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Code, Activity, Server, FileQuestion, ChevronRight, Zap, Search } from 'lucide-react';

type AlgorithmType = 'Bubble Sort' | 'Selection Sort' | 'Insertion Sort' | 'Merge Sort' | 'Quick Sort' | 'Linear Search' | 'Binary Search';

interface AlgorithmData {
  title: string;
  category: 'Sorting' | 'Searching';
  definition: string;
  working: string;
  pseudoCode: string;
  timeComplexity: { best: string, average: string, worst: string };
  spaceComplexity: string;
  advantages: string[];
  disadvantages: string[];
  applications: string[];
  interviewQuestions: { q: string, a: string }[];
}

const algorithmsData: Record<AlgorithmType, AlgorithmData> = {
  'Bubble Sort': {
    title: 'Bubble Sort',
    category: 'Sorting',
    definition: 'Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
    working: '1. Start from the first element, compare the current element with the next element of the array.\n2. If the current element is greater than the next element of the array, swap them.\n3. If the current element is less than the next element, move to the next element.\n4. Repeat Step 1.',
    pseudoCode: `function bubbleSort(arr):
  n = length(arr)
  for i from 0 to n-1:
    swapped = false
    for j from 0 to n-i-1:
      if arr[j] > arr[j+1]:
        swap(arr[j], arr[j+1])
        swapped = true
    if not swapped:
      break
  return arr`,
    timeComplexity: { best: 'O(n)', average: 'O(n^2)', worst: 'O(n^2)' },
    spaceComplexity: 'O(1)',
    advantages: [
      'Simple to write, easy to understand.',
      'It only takes a few lines of code.',
      'The data is sorted in place so there is little memory overhead.'
    ],
    disadvantages: [
      'Extremely slow for large datasets.',
      'O(n^2) time complexity makes it highly inefficient.'
    ],
    applications: [
      'Used as an educational tool for introductory programming.',
      'Used in computer graphics to detect a very small error (almost sorted array) and fix it with linear complexity (O(n)).'
    ],
    interviewQuestions: [
      { q: 'Is Bubble Sort a stable algorithm?', a: 'Yes, it is a stable algorithm because it does not swap elements with equal values, preserving their original relative order.' },
      { q: 'How can you optimize Bubble Sort?', a: 'By introducing a boolean flag to check if any swap happened in the inner loop. If no swap occurs, the array is already sorted, and we can break the loop early.' }
    ]
  },
  'Selection Sort': {
    title: 'Selection Sort',
    category: 'Sorting',
    definition: 'Selection sort is an in-place comparison sorting algorithm. It divides the input list into two parts: a sorted sublist of items which is built up from left to right at the front (left) of the list and a sublist of the remaining unsorted items that occupy the rest of the list.',
    working: '1. Set MIN to location 0.\n2. Search the minimum element in the list.\n3. Swap with value at location MIN.\n4. Increment MIN to point to next element.\n5. Repeat until list is sorted.',
    pseudoCode: `function selectionSort(arr):
  n = length(arr)
  for i from 0 to n-1:
    min_idx = i
    for j from i+1 to n:
      if arr[j] < arr[min_idx]:
        min_idx = j
    swap(arr[i], arr[min_idx])
  return arr`,
    timeComplexity: { best: 'O(n^2)', average: 'O(n^2)', worst: 'O(n^2)' },
    spaceComplexity: 'O(1)',
    advantages: [
      'Performs well on small lists.',
      'In-place algorithm (no additional memory required).',
      'Makes the minimum possible number of swaps (O(n)).'
    ],
    disadvantages: [
      'Poor performance on large lists.',
      'Time complexity is always O(n^2) even if the array is already sorted.'
    ],
    applications: [
      'Used when memory write is a costly operation (since it minimizes swaps).',
      'Suitable for small datasets where auxiliary memory is limited.'
    ],
    interviewQuestions: [
      { q: 'Is Selection Sort stable?', a: 'No, default Selection Sort is not stable because swapping might change the relative order of equal elements.' },
      { q: 'Why is Selection Sort sometimes preferred over Bubble Sort?', a: 'Selection Sort never makes more than O(n) swaps, making it useful when writing to memory is significantly more expensive than reading.' }
    ]
  },
  'Insertion Sort': {
    title: 'Insertion Sort',
    category: 'Sorting',
    definition: 'Insertion sort is a simple sorting algorithm that builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.',
    working: '1. The first element is assumed to be sorted.\n2. Take the next element and store it separately in a key.\n3. Compare key with all elements in the sorted array.\n4. If the element in the sorted array is smaller than the current element, move to the next element. Else, shift greater elements to the right.\n5. Insert the value.',
    pseudoCode: `function insertionSort(arr):
  n = length(arr)
  for i from 1 to n-1:
    key = arr[i]
    j = i - 1
    while j >= 0 and arr[j] > key:
      arr[j + 1] = arr[j]
      j = j - 1
    arr[j + 1] = key
  return arr`,
    timeComplexity: { best: 'O(n)', average: 'O(n^2)', worst: 'O(n^2)' },
    spaceComplexity: 'O(1)',
    advantages: [
      'Simple implementation.',
      'Efficient for (quite) small data sets.',
      'More efficient in practice than most other simple quadratic (i.e., O(n^2)) algorithms.',
      'Adaptive: Efficient for data sets that are already substantially sorted.'
    ],
    disadvantages: [
      'Inefficient for large datasets compared to algorithms like Quick Sort or Merge Sort.'
    ],
    applications: [
      'Used when the array is almost sorted (only a few elements are misplaced).',
      'Used in hybrid algorithms like Timsort (used in Python and Java).'
    ],
    interviewQuestions: [
      { q: 'When does Insertion Sort perform its worst?', a: 'It performs worst when the array is sorted in reverse order, as every element must be shifted for every insertion.' },
      { q: 'Is it an in-place sorting algorithm?', a: 'Yes, it only requires a constant amount O(1) of additional memory space.' }
    ]
  },
  'Merge Sort': {
    title: 'Merge Sort',
    category: 'Sorting',
    definition: 'Merge Sort is an efficient, general-purpose, and comparison-based sorting algorithm. It is a divide-and-conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.',
    working: '1. Divide the unsorted list into n sublists, each containing one element (a list of one element is considered sorted).\n2. Repeatedly merge sublists to produce new sorted sublists until there is only one sorted list remaining. This will be the sorted list.',
    pseudoCode: `function mergeSort(arr):
  if length(arr) <= 1:
    return arr
  mid = length(arr) / 2
  left = mergeSort(arr[0...mid])
  right = mergeSort(arr[mid...end])
  return merge(left, right)

function merge(left, right):
  result = []
  while left is not empty and right is not empty:
    if left[0] <= right[0]:
      append left[0] to result
      left = left[1...end]
    else:
      append right[0] to result
      right = right[1...end]
  append remaining elements to result
  return result`,
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    advantages: [
      'Guaranteed O(n log n) time complexity.',
      'Stable sort: preserves the relative order of equal elements.',
      'Excellent for sorting linked lists.'
    ],
    disadvantages: [
      'Requires additional memory space O(n) for the temporary array.',
      'Slower than Quick Sort in practice for smaller arrays.'
    ],
    applications: [
      'Used in E-commerce platforms to sort large product catalogs.',
      'Highly utilized in external sorting algorithms where data is too large to fit into memory.'
    ],
    interviewQuestions: [
      { q: 'Is Merge Sort in-place?', a: 'No, standard Merge Sort requires O(n) auxiliary space to merge the divided arrays.' },
      { q: 'Why is Merge Sort preferred for Linked Lists?', a: 'Unlike arrays, elements in a linked list can be inserted in the middle in O(1) extra space and O(1) time if we are given a reference to the previous node. Thus, we can merge without allocating extra space O(n).' }
    ]
  },
  'Quick Sort': {
    title: 'Quick Sort',
    category: 'Sorting',
    definition: 'Quicksort is an efficient, general-purpose sorting algorithm. Quicksort is a divide-and-conquer algorithm. It works by selecting a \'pivot\' element from the array and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot.',
    working: '1. Choose a pivot element.\n2. Partition the array: reorder so all elements less than the pivot come before it, and all elements greater come after it.\n3. Recursively apply the above steps to the sub-arrays of elements with smaller values and elements with greater values.',
    pseudoCode: `function quickSort(arr, low, high):
  if low < high:
    pi = partition(arr, low, high)
    quickSort(arr, low, pi - 1)
    quickSort(arr, pi + 1, high)

function partition(arr, low, high):
  pivot = arr[high]
  i = low - 1
  for j from low to high - 1:
    if arr[j] < pivot:
      i++
      swap(arr[i], arr[j])
  swap(arr[i + 1], arr[high])
  return i + 1`,
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n^2)' },
    spaceComplexity: 'O(log n)',
    advantages: [
      'Often faster in practice than other O(n log n) algorithms.',
      'In-place sort (only requires O(log n) stack space).',
      'Cache-friendly due to good locality of reference.'
    ],
    disadvantages: [
      'Worst-case time complexity is O(n^2) if bad pivots are chosen repeatedly.',
      'Not a stable sort by default.'
    ],
    applications: [
      'Used everywhere! It is the default sorting algorithm for primitive types in Java, C++ (std::sort is typically IntroSort which uses QuickSort), and many other languages.',
      'Excellent for memory-constrained environments due to low space complexity.'
    ],
    interviewQuestions: [
      { q: 'How do you avoid the O(n^2) worst-case in Quick Sort?', a: 'By using Randomized Quick Sort (picking a random pivot) or Median-of-Three pivot selection.' },
      { q: 'Which is better, Quick Sort or Merge Sort?', a: 'Quick Sort is generally faster for arrays due to better cache locality and zero extra allocation. Merge Sort is better for linked lists and guarantees O(n log n).' }
    ]
  },
  'Linear Search': {
    title: 'Linear Search',
    category: 'Searching',
    definition: 'Linear search is a very simple search algorithm. In this type of search, a sequential search is made over all items one by one. Every item is checked and if a match is found then that particular item is returned, otherwise the search continues till the end of the data collection.',
    working: '1. Start from the leftmost element of array arr[] and one by one compare x with each element of arr[].\n2. If x matches with an element, return the index.\n3. If x doesn’t match with any of elements, return -1.',
    pseudoCode: `function linearSearch(arr, target):
  for index from 0 to length(arr) - 1:
    if arr[index] == target:
      return index
  return -1`,
    timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(1)',
    advantages: [
      'Extremely simple and easy to implement.',
      'Works on unsorted arrays as well as sorted ones.',
      'No extra memory is required.'
    ],
    disadvantages: [
      'Very slow for large datasets. O(n) complexity means doubling data doubles search time.'
    ],
    applications: [
      'Searching in an unsorted list where data is small.',
      'When memory space is severely limited and complex data structures cannot be used.'
    ],
    interviewQuestions: [
      { q: 'When is Linear Search better than Binary Search?', a: 'When the array is small, or more importantly, when the array is UNSORTED. Binary Search requires sorted data.' },
      { q: 'What is the best-case complexity?', a: 'O(1), which occurs if the target element is the very first element in the array.' }
    ]
  },
  'Binary Search': {
    title: 'Binary Search',
    category: 'Searching',
    definition: 'Binary Search is a searching algorithm used in a sorted array by repeatedly dividing the search interval in half. The idea of binary search is to use the information that the array is sorted and reduce the time complexity to O(log n).',
    working: '1. Compare x with the middle element.\n2. If x matches with middle element, we return the mid index.\n3. Else If x is greater than the mid element, then x can only lie in right half subarray after the mid element. So we recur for right half.\n4. Else (x is smaller) recur for the left half.',
    pseudoCode: `function binarySearch(arr, target):
  low = 0
  high = length(arr) - 1
  while low <= high:
    mid = low + (high - low) / 2
    if arr[mid] == target:
      return mid
    if arr[mid] < target:
      low = mid + 1
    else:
      high = mid - 1
  return -1`,
    timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
    spaceComplexity: 'O(1)',
    advantages: [
      'Extremely fast for large datasets (O(log n) complexity).',
      'Does not require extra space (iterative approach).'
    ],
    disadvantages: [
      'Requires the data to be sorted beforehand.',
      'Requires random access to data (e.g. Arrays), so it is inefficient for Linked Lists.'
    ],
    applications: [
      'Used in libraries (e.g., Java Collections.binarySearch) for fast lookups in sorted collections.',
      'Used in debugging to find the specific commit that introduced a bug (Git Bisect).'
    ],
    interviewQuestions: [
      { q: 'Why do we use `low + (high - low) / 2` instead of `(low + high) / 2` to find the mid?', a: 'To prevent integer overflow in strongly typed languages like C++ or Java when low and high are very large values.' },
      { q: 'Can Binary Search be used on a Linked List?', a: 'Yes, but it takes O(n) time to access the middle element, destroying the O(log n) efficiency. So practically, no.' }
    ]
  }
};

export default function LearnAlgorithms() {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmType>('Bubble Sort');
  const data = algorithmsData[selectedAlgo];

  const categories = {
    'Sorting': ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort', 'Quick Sort'],
    'Searching': ['Linear Search', 'Binary Search']
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Learn Algorithms</h2>
          <p className="text-gray-400 text-sm">Educational Wiki for Data Structures & Algorithms</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {Object.entries(categories).map(([category, algos]) => (
            <div key={category} className="glass-panel p-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{category}</h3>
              <div className="space-y-1">
                {algos.map((algo) => (
                  <button
                    key={algo}
                    onClick={() => setSelectedAlgo(algo as AlgorithmType)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex justify-between items-center ${
                      selectedAlgo === algo 
                        ? 'bg-emergency-accent-blue text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{algo}</span>
                    {selectedAlgo === algo && <ChevronRight size={16} />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedAlgo}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="glass-panel p-6 sm:p-8 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  {data.category === 'Sorting' ? <Activity size={120} /> : <Search size={120} />}
                </div>
                <div className="relative z-10">
                  <span className="px-3 py-1 bg-emergency-accent-blue/20 text-blue-400 text-xs font-bold rounded-full mb-4 inline-block">
                    {data.category} Algorithm
                  </span>
                  <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
                  <p className="text-lg text-gray-300 leading-relaxed">{data.definition}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Working Steps */}
                <div className="glass-panel p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center text-orange-400">
                    <Zap size={20} className="mr-2" /> How it Works
                  </h3>
                  <div className="space-y-3">
                    {data.working.split('\n').map((step, idx) => (
                      <div key={idx} className="flex">
                        <span className="text-gray-500 mr-3 font-mono">{idx + 1}.</span>
                        <p className="text-gray-300 text-sm">{step.replace(/^\d+\.\s/, '')}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Complexity */}
                <div className="glass-panel p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center text-green-400">
                    <Server size={20} className="mr-2" /> Complexity
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Time Complexity</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white/5 p-2 rounded text-center">
                          <span className="block text-xs text-gray-400 mb-1">Best</span>
                          <span className="font-mono text-sm text-green-400">{data.timeComplexity.best}</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded text-center">
                          <span className="block text-xs text-gray-400 mb-1">Average</span>
                          <span className="font-mono text-sm text-yellow-400">{data.timeComplexity.average}</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded text-center">
                          <span className="block text-xs text-gray-400 mb-1">Worst</span>
                          <span className="font-mono text-sm text-red-400">{data.timeComplexity.worst}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Space Complexity</h4>
                      <div className="bg-white/5 p-3 rounded flex justify-between items-center">
                        <span className="text-sm text-gray-300">Auxiliary Space</span>
                        <span className="font-mono font-bold text-blue-400">{data.spaceComplexity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pseudo Code */}
              <div className="glass-panel p-0 overflow-hidden border-l-4 border-l-blue-500">
                <div className="bg-slate-900/80 px-6 py-4 flex items-center border-b border-white/5">
                  <Code size={18} className="text-blue-400 mr-2" />
                  <h3 className="text-sm font-bold">Pseudo Code</h3>
                </div>
                <div className="p-6 overflow-x-auto">
                  <pre className="text-sm font-mono text-gray-300">
                    <code>{data.pseudoCode}</code>
                  </pre>
                </div>
              </div>

              {/* Pros, Cons & Applications */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 border-t-2 border-t-green-500">
                  <h3 className="font-bold text-green-400 mb-4">Advantages</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
                    {data.advantages.map((adv, i) => <li key={i}>{adv}</li>)}
                  </ul>
                </div>
                <div className="glass-panel p-6 border-t-2 border-t-red-500">
                  <h3 className="font-bold text-red-400 mb-4">Disadvantages</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
                    {data.disadvantages.map((dis, i) => <li key={i}>{dis}</li>)}
                  </ul>
                </div>
                <div className="glass-panel p-6 border-t-2 border-t-blue-500">
                  <h3 className="font-bold text-blue-400 mb-4">Applications</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
                    {data.applications.map((app, i) => <li key={i}>{app}</li>)}
                  </ul>
                </div>
              </div>

              {/* Interview Questions */}
              <div className="glass-panel p-6 border-l-4 border-l-purple-500">
                <h3 className="text-lg font-bold mb-6 flex items-center text-purple-400">
                  <FileQuestion size={20} className="mr-2" /> Interview Questions
                </h3>
                <div className="space-y-4">
                  {data.interviewQuestions.map((iq, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-4">
                      <p className="font-bold text-white mb-2 text-sm">Q: {iq.q}</p>
                      <p className="text-sm text-gray-400">A: {iq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
