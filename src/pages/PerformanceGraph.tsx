import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { bubbleSort } from '../algorithms/sorting/bubbleSort';
import { selectionSort } from '../algorithms/sorting/selectionSort';
import { insertionSort } from '../algorithms/sorting/insertionSort';
import { mergeSort } from '../algorithms/sorting/mergeSort';
import { quickSort } from '../algorithms/sorting/quickSort';
import { SortAlgorithm } from '../algorithms/sorting/types';
import { Play } from 'lucide-react';

const DATASET_SIZES = [10, 25, 50, 100, 500, 1000];

export default function PerformanceGraph() {
  const [data, setData] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateData = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const results = DATASET_SIZES.map(size => {
        const arr = Array.from({ length: size }, () => ({
          id: `Item`, name: 'R', quantity: Math.floor(Math.random() * 1000)
        }));

        const b = bubbleSort([...arr], 'quantity', 'asc', false);
        const s = selectionSort([...arr], 'quantity', 'asc', false);
        const i = insertionSort([...arr], 'quantity', 'asc', false);
        const m = mergeSort([...arr], 'quantity', 'asc', false);
        const q = quickSort([...arr], 'quantity', 'asc', false);

        return {
          size,
          'Bubble Sort': b.executionTime,
          'Selection Sort': s.executionTime,
          'Insertion Sort': i.executionTime,
          'Merge Sort': m.executionTime,
          'Quick Sort': q.executionTime,
        };
      });

      setData(results);
      setIsGenerating(false);
    }, 100);
  };

  useEffect(() => {
    generateData();
  }, []);

  const COLORS: Record<SortAlgorithm, string> = {
    'Bubble': '#F87171',
    'Selection': '#FBBF24',
    'Insertion': '#34D399',
    'Merge': '#60A5FA',
    'Quick': '#A78BFA'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Performance Analytics</h2>
          <p className="text-gray-400 text-sm">Empirical Time Complexity Analysis</p>
        </div>
        
        <button 
          onClick={generateData}
          disabled={isGenerating}
          className="px-6 py-2 bg-emergency-accent-blue hover:bg-blue-600 disabled:opacity-50 rounded-lg font-bold flex items-center space-x-2 transition-colors"
        >
          <Play size={18} />
          <span>{isGenerating ? 'Running Tests...' : 'Run Benchmark'}</span>
        </button>
      </div>

      <div className="glass-panel p-6 h-[500px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="size" stroke="#94A3B8" label={{ value: 'Dataset Size (N)', position: 'insideBottom', offset: -10, fill: '#94A3B8' }} />
              <YAxis stroke="#94A3B8" label={{ value: 'Execution Time (ms)', angle: -90, position: 'insideLeft', fill: '#94A3B8' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend verticalAlign="top" height={36}/>
              {(['Bubble', 'Selection', 'Insertion', 'Merge', 'Quick'] as SortAlgorithm[]).map((algo) => (
                <Line 
                  key={algo}
                  type="monotone" 
                  dataKey={`${algo} Sort`} 
                  stroke={COLORS[algo]} 
                  strokeWidth={3}
                  activeDot={{ r: 8 }} 
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Running benchmarks...
          </div>
        )}
      </div>
    </div>
  );
}
