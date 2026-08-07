import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Award, Zap, Database, Clock, RefreshCcw } from 'lucide-react';
import { bubbleSort } from '../algorithms/sorting/bubbleSort';
import { selectionSort } from '../algorithms/sorting/selectionSort';
import { insertionSort } from '../algorithms/sorting/insertionSort';
import { mergeSort } from '../algorithms/sorting/mergeSort';
import { quickSort } from '../algorithms/sorting/quickSort';
import { SortResult } from '../algorithms/sorting/types';

interface ResourceItem {
  id: string;
  name: string;
  quantity: number;
}

const generateRandomData = (count: number): ResourceItem[] => {
  const items: ResourceItem[] = [];
  for (let i = 0; i < count; i++) {
    items.push({
      id: `Item-${i}`,
      name: `Resource-${i}`,
      quantity: Math.floor(Math.random() * 1000),
    });
  }
  return items;
};

interface LabResult {
  algo: string;
  result: SortResult<ResourceItem> | null;
  timeComplexity: string;
  spaceComplexity: string;
  stable: boolean;
}

export default function AlgorithmLab() {
  const [dataSize, setDataSize] = useState<number>(50);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<LabResult[]>([
    { algo: 'Bubble Sort', result: null, timeComplexity: 'O(N²)', spaceComplexity: 'O(1)', stable: true },
    { algo: 'Selection Sort', result: null, timeComplexity: 'O(N²)', spaceComplexity: 'O(1)', stable: false },
    { algo: 'Insertion Sort', result: null, timeComplexity: 'O(N²)', spaceComplexity: 'O(1)', stable: true },
    { algo: 'Merge Sort', result: null, timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)', stable: true },
    { algo: 'Quick Sort', result: null, timeComplexity: 'O(N log N)', spaceComplexity: 'O(log N)', stable: false },
  ]);

  const runLab = () => {
    setIsRunning(true);
    const dataset = generateRandomData(dataSize);

    // Run algorithms asynchronously to avoid blocking UI fully, though JS is single-threaded
    // We'll use timeouts to allow UI to show "Running..."
    setTimeout(() => {
      const updatedResults = [...results];

      // Bubble
      const bData = [...dataset];
      updatedResults[0].result = bubbleSort(bData, 'quantity', 'asc', false);

      // Selection
      const sData = [...dataset];
      updatedResults[1].result = selectionSort(sData, 'quantity', 'asc', false);

      // Insertion
      const iData = [...dataset];
      updatedResults[2].result = insertionSort(iData, 'quantity', 'asc', false);

      // Merge
      const mData = [...dataset];
      updatedResults[3].result = mergeSort(mData, 'quantity', 'asc', false);

      // Quick
      const qData = [...dataset];
      updatedResults[4].result = quickSort(qData, 'quantity', 'asc', false);

      setResults(updatedResults);
      setIsRunning(false);
    }, 100);
  };

  const getFastest = () => {
    if (!results[0].result) return null;
    let minTime = Infinity;
    let fastestAlgo = '';
    results.forEach(r => {
      if (r.result && r.result.executionTime < minTime) {
        minTime = r.result.executionTime;
        fastestAlgo = r.algo;
      }
    });
    return fastestAlgo;
  };

  const fastest = getFastest();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Algorithm Performance Lab</h2>
          <p className="text-gray-400 text-sm">Race algorithms simultaneously on identical datasets</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select 
            value={dataSize}
            onChange={(e) => setDataSize(Number(e.target.value))}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-emergency-accent-blue"
          >
            <option value={10}>10 Items</option>
            <option value={25}>25 Items</option>
            <option value={50}>50 Items</option>
            <option value={100}>100 Items</option>
            <option value={500}>500 Items</option>
            <option value={1000}>1000 Items</option>
          </select>

          <button 
            onClick={runLab}
            disabled={isRunning}
            className="px-6 py-2 bg-emergency-accent-blue hover:bg-blue-600 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg font-bold flex items-center space-x-2 transition-colors shadow-lg"
          >
            {isRunning ? <RefreshCcw size={18} className="animate-spin" /> : <Play size={18} />}
            <span>{isRunning ? 'Racing...' : 'Start Race'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {results.map((res, index) => {
          const isWinner = res.algo === fastest;
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={res.algo} 
              className={`glass-panel p-6 relative overflow-hidden transition-all duration-500 ${isWinner ? 'border-green-500/50 glow-green' : 'border-white/10'}`}
            >
              {isWinner && (
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-green-500/20 rounded-full blur-2xl pointer-events-none" />
              )}
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold flex items-center space-x-2">
                    {res.algo}
                    {isWinner && <Award size={20} className="text-green-400 ml-2 animate-bounce" />}
                  </h3>
                  <div className="flex space-x-2 mt-1">
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300">Time: {res.timeComplexity}</span>
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300">Space: {res.spaceComplexity}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${res.stable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {res.stable ? 'Stable' : 'Unstable'}
                    </span>
                  </div>
                </div>
              </div>

              {res.result ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                    <p className="text-xs text-gray-400 flex items-center space-x-1 mb-1"><Clock size={12} /> <span>Time (ms)</span></p>
                    <p className="text-lg font-bold font-mono text-emergency-accent-blue">{res.result.executionTime.toFixed(4)}</p>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                    <p className="text-xs text-gray-400 flex items-center space-x-1 mb-1"><Zap size={12} /> <span>Comparisons</span></p>
                    <p className="text-lg font-bold font-mono text-emergency-orange">{res.result.comparisons.toLocaleString()}</p>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                    <p className="text-xs text-gray-400 flex items-center space-x-1 mb-1"><RefreshCcw size={12} /> <span>Swaps/Shifts</span></p>
                    <p className="text-lg font-bold font-mono text-emergency-red">{res.result.swaps.toLocaleString()}</p>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                    <p className="text-xs text-gray-400 flex items-center space-x-1 mb-1"><Database size={12} /> <span>Memory</span></p>
                    <p className="text-lg font-bold font-mono text-purple-400">~{res.result.memoryUsage} B</p>
                  </div>
                </div>
              ) : (
                <div className="h-[148px] flex items-center justify-center text-gray-500 bg-black/10 rounded-lg border border-white/5 border-dashed">
                  Click 'Start Race' to view results
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
