import React, { useState } from 'react';
import { motion } from 'framer-motion';

const INITIAL_RESOURCES = [
  { id: 1, name: 'Water', priority: 3, color: 'bg-blue-500' },
  { id: 2, name: 'Medicine', priority: 1, color: 'bg-red-500' },
  { id: 3, name: 'Food', priority: 2, color: 'bg-orange-500' },
  { id: 4, name: 'Fuel', priority: 6, color: 'bg-yellow-500' },
  { id: 5, name: 'Blankets', priority: 5, color: 'bg-indigo-500' },
  { id: 6, name: 'Tents', priority: 4, color: 'bg-green-500' },
];

export default function DSAInteractiveDemo() {
  const [resources, setResources] = useState([...INITIAL_RESOURCES]);
  const [isSorting, setIsSorting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [message, setMessage] = useState('Interact with the algorithms to see them in action.');

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runBubbleSort = async () => {
    if (isSorting || isSearching) return;
    setIsSorting(true);
    setFoundIndex(null);
    setMessage('Bubble Sort: Comparing adjacent elements and swapping if they are in the wrong order.');

    let arr = [...INITIAL_RESOURCES];
    setResources([...arr]);
    await sleep(500);

    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setActiveIndices([j, j + 1]);
        await sleep(600);
        if (arr[j].priority > arr[j + 1].priority) {
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setResources([...arr]);
          await sleep(600);
        }
      }
    }
    setActiveIndices([]);
    setIsSorting(false);
    setMessage('Resources sorted by priority (1 is highest)!');
  };

  const runBinarySearch = async () => {
    if (isSorting || isSearching) return;
    
    // Binary Search requires sorted array
    let arr = [...INITIAL_RESOURCES].sort((a, b) => a.priority - b.priority);
    setResources(arr);
    setIsSearching(true);
    setFoundIndex(null);
    setMessage('Binary Search: Array must be sorted first. Looking for "Tents" (Priority 4).');
    await sleep(1500);

    let left = 0;
    let right = arr.length - 1;
    let targetPriority = 4; // Tents

    while (left <= right) {
      let mid = Math.floor((left + right) / 2);
      setActiveIndices([left, right, mid]);
      setMessage(`Searching between indices ${left} and ${right}. Middle is ${mid} (${arr[mid].name}).`);
      await sleep(1500);

      if (arr[mid].priority === targetPriority) {
        setFoundIndex(mid);
        setActiveIndices([]);
        setMessage(`Found "Tents" at index ${mid}! O(log N) efficiency.`);
        setIsSearching(false);
        return;
      } else if (arr[mid].priority < targetPriority) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    setIsSearching(false);
  };

  const reset = () => {
    setResources([...INITIAL_RESOURCES]);
    setActiveIndices([]);
    setFoundIndex(null);
    setMessage('Interact with the algorithms to see them in action.');
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass-panel p-8 rounded-2xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-md relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
      
      <div className="text-center mb-10 relative z-10">
        <h3 className="text-2xl font-bold text-white mb-2">Algorithm Visualizer</h3>
        <p className="text-gray-400 h-6">{message}</p>
      </div>

      <div className="flex justify-center items-end space-x-2 sm:space-x-4 mb-16 h-48 relative z-10">
        {resources.map((res, idx) => {
          const isActive = activeIndices.includes(idx);
          const isMid = activeIndices.length === 3 && activeIndices[2] === idx;
          const isFound = foundIndex === idx;

          return (
            <motion.div
              layout
              key={res.id}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`flex flex-col items-center justify-end w-12 sm:w-16 rounded-t-lg ${res.color} relative ${isActive ? 'ring-4 ring-white/50' : ''} ${isFound ? 'ring-4 ring-green-400 animate-pulse' : ''}`}
              style={{ height: `${(8 - res.priority) * 12}%` }}
            >
              <div className="absolute -top-8 text-xs font-bold text-white whitespace-nowrap bg-black/50 px-2 py-1 rounded">
                P: {res.priority}
              </div>
              <div className="text-white text-xs sm:text-sm font-bold mb-4 transform -rotate-90 origin-bottom sm:rotate-0 whitespace-nowrap">
                {res.name}
              </div>
              
              {/* Binary search labels */}
              {isSearching && activeIndices[0] === idx && <div className="absolute -bottom-8 text-xs text-blue-300 font-bold bg-blue-900/50 px-2 py-1 rounded">L</div>}
              {isSearching && activeIndices[1] === idx && <div className="absolute -bottom-8 text-xs text-blue-300 font-bold bg-blue-900/50 px-2 py-1 rounded">R</div>}
              {isSearching && isMid && <div className="absolute -bottom-14 text-xs text-orange-400 font-bold bg-orange-900/50 px-2 py-1 rounded">M</div>}
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-4 relative z-10">
        <button 
          onClick={runBubbleSort}
          disabled={isSorting || isSearching}
          className="px-6 py-3 bg-blue-600/80 hover:bg-blue-500 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-blue-400/30"
        >
          Run Bubble Sort
        </button>
        <button 
          onClick={runBinarySearch}
          disabled={isSorting || isSearching}
          className="px-6 py-3 bg-orange-600/80 hover:bg-orange-500 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-orange-400/30"
        >
          Run Binary Search
        </button>
        <button 
          onClick={reset}
          disabled={isSorting || isSearching}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
