import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, StepForward, StepBack, RotateCcw, Activity } from 'lucide-react';
import { bubbleSort } from '../algorithms/sorting/bubbleSort';
import { selectionSort } from '../algorithms/sorting/selectionSort';
import { insertionSort } from '../algorithms/sorting/insertionSort';
import { mergeSort } from '../algorithms/sorting/mergeSort';
import { quickSort } from '../algorithms/sorting/quickSort';
import { SortAlgorithm, SortResult, AnimationFrame } from '../algorithms/sorting/types';

interface ResourceItem {
  id: string;
  name: string;
  quantity: number;
}

const SortCard = memo(({ item, isCompared, isSwapped, isCompleted }: { item: ResourceItem, isCompared: boolean, isSwapped: boolean, isCompleted: boolean }) => {
  let cardColor = "from-emergency-accent-blue/80 to-blue-500";
  if (isCompleted) cardColor = "from-green-500/80 to-green-400 glow-green";
  else if (isSwapped) cardColor = "from-emergency-red/80 to-red-400 glow-red";
  else if (isCompared) cardColor = "from-emergency-orange/80 to-orange-400 glow-orange";

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`w-16 bg-gradient-to-t ${cardColor} rounded-t-md flex flex-col items-center justify-end pb-2 relative group`}
      style={{ height: `${(item.quantity / 500) * 100}%` }}
    >
      <span className="text-xs font-bold text-white mb-1">{item.quantity}</span>
      <div className="absolute -bottom-6 w-full text-center">
        <span className="text-[10px] text-gray-400 font-mono truncate px-1 block">{item.name}</span>
      </div>
    </motion.div>
  );
}, (prev, next) => {
  return prev.item.id === next.item.id 
    && prev.isCompared === next.isCompared 
    && prev.isSwapped === next.isSwapped 
    && prev.isCompleted === next.isCompleted;
});

const generateRandomData = (count: number): ResourceItem[] => {
  const items: ResourceItem[] = [];
  const categories = ['Water', 'Medicine', 'Food', 'Fuel', 'Blankets', 'Tents', 'Medical Kits'];
  for (let i = 0; i < count; i++) {
    items.push({
      id: `Item-${i}-${Math.random().toString(36).substr(2, 9)}`,
      name: categories[Math.floor(Math.random() * categories.length)],
      quantity: Math.floor(Math.random() * 500) + 10,
    });
  }
  return items;
};

export default function SortingVisualizer() {
  const [data, setData] = useState<ResourceItem[]>([]);
  const [initialData, setInitialData] = useState<ResourceItem[]>([]);
  const [selectedAlgo, setSelectedAlgo] = useState<SortAlgorithm>('Bubble');
  
  const [frames, setFrames] = useState<AnimationFrame<ResourceItem>[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(100); // ms per frame

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const newData = generateRandomData(15);
    setInitialData(newData);
    setData(newData);
  }, []);

  useEffect(() => {
    // Generate frames whenever algo changes or data resets
    let result: SortResult<ResourceItem>;
    const dataCopy = [...initialData];

    switch (selectedAlgo) {
      case 'Bubble': result = bubbleSort(dataCopy, 'quantity', 'asc'); break;
      case 'Selection': result = selectionSort(dataCopy, 'quantity', 'asc'); break;
      case 'Insertion': result = insertionSort(dataCopy, 'quantity', 'asc'); break;
      case 'Merge': result = mergeSort(dataCopy, 'quantity', 'asc'); break;
      case 'Quick': result = quickSort(dataCopy, 'quantity', 'asc'); break;
      default: result = bubbleSort(dataCopy, 'quantity', 'asc');
    }
    setFrames(result.frames);
    setCurrentFrameIndex(0);
    setData([...initialData]);
    setIsPlaying(false);
  }, [initialData, selectedAlgo]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        if (currentFrameIndex < frames.length - 1) {
          setCurrentFrameIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 500 - speed);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentFrameIndex, frames, speed]);

  const currentFrame = frames[currentFrameIndex];

  const handleReset = () => {
    setIsPlaying(false);
    const newData = generateRandomData(15);
    setInitialData(newData);
  };

  const handleReplay = () => {
    setIsPlaying(false);
    setCurrentFrameIndex(0);
  };

  const stepForward = () => {
    setIsPlaying(false);
    if (currentFrameIndex < frames.length - 1) setCurrentFrameIndex(prev => prev + 1);
  };

  const stepBack = () => {
    setIsPlaying(false);
    if (currentFrameIndex > 0) setCurrentFrameIndex(prev => prev - 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Advanced Sorting Visualizer</h2>
        <p className="text-gray-400 text-sm">Interactive step-by-step execution of sorting algorithms.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Main Visualizer Area */}
        <div className="xl:col-span-3 space-y-6">
          <div className="glass-panel p-4 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex space-x-2">
              {(['Bubble', 'Selection', 'Insertion', 'Merge', 'Quick'] as SortAlgorithm[]).map((algo) => (
                <button
                  key={algo}
                  onClick={() => setSelectedAlgo(algo)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedAlgo === algo 
                      ? 'bg-emergency-accent-blue text-white' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {algo}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Speed:</span>
              <input 
                type="range" 
                min="50" 
                max="450" 
                value={speed} 
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-24 accent-emergency-accent-blue"
              />
            </div>
          </div>

          <div className="glass-panel p-8 h-[450px] flex items-end justify-center space-x-2 overflow-hidden relative">
            {currentFrame && currentFrame.array.map((item, index) => {
              const isCompared = currentFrame.comparedIndices.includes(index);
              const isSwapped = currentFrame.swappedIndices.includes(index);
              const isCompleted = currentFrame.completedIndices.includes(index);
              
              return (
                <SortCard 
                  key={item.id} 
                  item={item} 
                  isCompared={isCompared} 
                  isSwapped={isSwapped} 
                  isCompleted={isCompleted} 
                />
              );
            })}
          </div>

          <div className="glass-panel p-4 flex justify-between items-center bg-emergency-card/90">
            <div className="flex space-x-2">
              <button onClick={handleReset} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white" title="New Random Data"><RotateCcw size={20} /></button>
              <button onClick={stepBack} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white" title="Step Back"><StepBack size={20} /></button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-6 py-2 rounded-lg font-bold flex items-center space-x-2 transition-colors ${isPlaying ? 'bg-emergency-orange hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'}`}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                <span>{isPlaying ? 'Pause' : currentFrameIndex === frames.length - 1 ? 'Replay' : 'Play'}</span>
              </button>
              <button onClick={stepForward} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white" title="Step Forward"><StepForward size={20} /></button>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-300">
                Progress: {currentFrameIndex + 1} / {frames.length}
              </p>
            </div>
          </div>
        </div>

        {/* Live Complexity & Education Panel */}
        <div className="xl:col-span-1 space-y-6">
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold flex items-center space-x-2 mb-4">
              <Activity className="text-emergency-accent-blue" size={20} />
              <span>Education Mode</span>
            </h3>
            
            <div className="bg-black/30 p-4 rounded-lg border border-white/5 mb-6 min-h-[100px]">
              <p className="text-sm leading-relaxed text-gray-200">
                <span className="text-emergency-accent-blue font-bold">Step {currentFrameIndex + 1}: </span> 
                {currentFrame?.explanation || 'Ready.'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-sm text-gray-400">Current Pass</span>
                <span className="font-mono font-bold text-white">{currentFrame?.passNumber || 0}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-sm text-gray-400">Comparisons</span>
                <span className="font-mono font-bold text-emergency-orange">
                  {/* Estimating comparisons visually for the demo since we don't track a running total per frame perfectly, but we can approximate it or modify types */}
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-sm text-gray-400">Swaps</span>
                <span className="font-mono font-bold text-emergency-red">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-sm text-gray-400">Status</span>
                <span className="font-mono font-bold text-green-400">
                  {currentFrameIndex === frames.length - 1 ? 'Complete' : 'Running'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
