import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, StepForward, StepBack, RotateCcw, Activity, Search as SearchIcon, Info, Database } from 'lucide-react';
import { linearSearch } from '../algorithms/searching/linearSearch';
import { binarySearch } from '../algorithms/searching/binarySearch';
import { useSearchAnimator } from '../utils/SearchAnimator';

interface ResourceItem {
  id: string;
  name: string;
  quantity: number;
  priority: string;
}

const generateRandomData = (count: number): ResourceItem[] => {
  const items: ResourceItem[] = [];
  const priorities = ['Critical', 'High', 'Medium', 'Low', 'Very Low'];
  for (let i = 0; i < count; i++) {
    items.push({
      id: `Item-${i}`,
      name: `Resource-${Math.floor(Math.random() * 1000)}`,
      quantity: Math.floor(Math.random() * 500) + 10,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
    });
  }
  return items;
};

const SearchPodCard = memo(({ item, index, isActive, isDiscarded, isFound, isPointer, pointerText }: { 
  item: ResourceItem, 
  index: number, 
  isActive: boolean, 
  isDiscarded: boolean, 
  isFound: boolean, 
  isPointer: boolean,
  pointerText: string
}) => {
  let boxColor = "bg-white/10 border-white/20";
  let textColor = "text-white";

  if (isDiscarded) {
    boxColor = "bg-gray-800/50 border-gray-700/50 opacity-20 grayscale";
    textColor = "text-gray-500";
  } else if (isFound) {
    boxColor = "bg-green-500/20 border-green-500 glow-green scale-110 z-20";
    textColor = "text-green-400 font-bold";
  } else if (isActive) {
    boxColor = "bg-emergency-accent-blue/20 border-emergency-accent-blue glow-blue scale-105 z-10";
    textColor = "text-blue-400 font-bold";
  } else if (isPointer) {
    boxColor = "bg-emergency-orange/20 border-emergency-orange shadow-[0_0_15px_rgba(249,115,22,0.3)]";
    textColor = "text-orange-400";
  }

  return (
    <div className="flex flex-col items-center space-y-2 min-w-[80px]">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`w-20 p-2 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 ${boxColor}`}
      >
        <span className="text-[10px] text-gray-400 truncate w-full text-center mb-1">{item.name}</span>
        <span className={`text-lg ${textColor}`}>{item.quantity}</span>
        <span className="text-[8px] uppercase tracking-wider text-gray-500 mt-1">{item.priority}</span>
      </motion.div>
      <div className="h-4 flex text-[12px] font-bold text-gray-300 space-x-1" dangerouslySetInnerHTML={{__html: pointerText}} />
      <span className="text-[10px] text-gray-500 font-mono">[{index}]</span>
    </div>
  );
}, (prev, next) => {
  return prev.item.id === next.item.id 
    && prev.isActive === next.isActive 
    && prev.isDiscarded === next.isDiscarded 
    && prev.isFound === next.isFound
    && prev.isPointer === next.isPointer
    && prev.pointerText === next.pointerText;
});

export default function SearchVisualizer() {
  const [initialData, setInitialData] = useState<ResourceItem[]>([]);
  const [data, setData] = useState<ResourceItem[]>([]);
  const [selectedAlgo, setSelectedAlgo] = useState<'Linear' | 'Binary'>('Linear');
  const [targetQuantity, setTargetQuantity] = useState<number>(0);
  const [executionTimeMs, setExecutionTimeMs] = useState<number>(0);
  const [totalComparisons, setTotalComparisons] = useState<number>(0);

  const {
    frames,
    currentFrame,
    currentFrameIndex,
    isPlaying,
    isFinished,
    speed,
    setSpeed,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    loadFrames
  } = useSearchAnimator<ResourceItem>(150);

  useEffect(() => {
    handleResetData();
  }, []);

  const handleResetData = () => {
    reset();
    const newData = generateRandomData(25);
    const randomTarget = newData[Math.floor(Math.random() * newData.length)].quantity;
    setInitialData(newData);
    setData(newData);
    setTargetQuantity(randomTarget);
    setExecutionTimeMs(0);
    setTotalComparisons(0);
  };

  const handleSearch = () => {
    reset();
    let resultFrames: any[] = [];
    
    if (selectedAlgo === 'Linear') {
      const res = linearSearch(initialData, 'quantity', targetQuantity);
      resultFrames = res.frames;
      setData([...initialData]);
      setExecutionTimeMs(res.executionTime);
      setTotalComparisons(res.comparisons);
    } else {
      const { searchResult, sortedArray } = binarySearch(initialData, 'quantity', targetQuantity);
      resultFrames = searchResult.frames;
      setData(sortedArray); 
      setExecutionTimeMs(searchResult.executionTime);
      setTotalComparisons(searchResult.comparisons);
    }
    
    loadFrames(resultFrames);
  };

  const isControlsDisabled = isPlaying;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Search Visualizer</h2>
        <p className="text-gray-400 text-sm">Interactive step-by-step execution of searching algorithms.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Main Visualizer Area */}
        <div className="xl:col-span-3 space-y-6">
          <div className="glass-panel p-4 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex space-x-2">
              <button
                disabled={isControlsDisabled}
                onClick={() => { setSelectedAlgo('Linear'); reset(); setData(initialData); }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  selectedAlgo === 'Linear' ? 'bg-emergency-accent-blue text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Linear Search
              </button>
              <button
                disabled={isControlsDisabled}
                onClick={() => { setSelectedAlgo('Binary'); reset(); setData(initialData); }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  selectedAlgo === 'Binary' ? 'bg-emergency-accent-blue text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Binary Search
              </button>
            </div>

            <div className="flex items-center space-x-4 flex-1 justify-center max-w-sm">
              <input 
                type="number" 
                disabled={isControlsDisabled}
                value={targetQuantity}
                onChange={(e) => setTargetQuantity(Number(e.target.value))}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-emergency-accent-blue w-full disabled:opacity-50"
                placeholder="Target Quantity"
              />
              <button 
                disabled={isControlsDisabled}
                onClick={handleSearch}
                className="px-4 py-2 bg-emergency-accent-blue hover:bg-blue-600 rounded-lg flex items-center space-x-2 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              >
                <SearchIcon size={18} />
                <span>Find</span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Speed:</span>
              <input 
                type="range" min="50" max="450" value={speed} onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-24 accent-emergency-accent-blue"
              />
            </div>
          </div>

          <div className="glass-panel p-8 h-[400px] flex items-center justify-start overflow-x-auto relative custom-scrollbar">
            <div className="flex items-center space-x-4 min-w-max mx-auto px-8">
              {data.map((item, index) => {
                let isActive = false;
                let isDiscarded = false;
                let isFound = false;
                let isPointer = false;
                let pointerText = "";

                if (currentFrame) {
                  isActive = currentFrame.currentIndex === index;
                  isDiscarded = currentFrame.discardedIndices.includes(index);
                  isFound = isActive && currentFrame.found;
                  isPointer = selectedAlgo === 'Binary' && (currentFrame.lowPointer === index || currentFrame.highPointer === index || currentFrame.midPointer === index);
                  
                  if (currentFrame.lowPointer === index) pointerText += `<span class="text-blue-400 mx-1">L</span>`;
                  if (currentFrame.midPointer === index) pointerText += `<span class="text-orange-400 mx-1">M</span>`;
                  if (currentFrame.highPointer === index) pointerText += `<span class="text-red-400 mx-1">H</span>`;
                }

                return (
                  <SearchPodCard
                    key={item.id}
                    item={item}
                    index={index}
                    isActive={isActive}
                    isDiscarded={isDiscarded}
                    isFound={isFound}
                    isPointer={isPointer}
                    pointerText={pointerText}
                  />
                );
              })}
            </div>
          </div>

          <div className="glass-panel p-4 flex justify-between items-center bg-emergency-card/90">
            <div className="flex space-x-2">
              <button disabled={isPlaying} onClick={handleResetData} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white disabled:opacity-50" title="New Random Data"><RotateCcw size={20} /></button>
              <button disabled={isPlaying || currentFrameIndex === 0} onClick={stepBackward} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white disabled:opacity-50" title="Step Back"><StepBack size={20} /></button>
              <button 
                onClick={isPlaying ? pause : play}
                disabled={frames.length === 0 || isFinished}
                className={`px-6 py-2 rounded-lg font-bold flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isPlaying ? 'bg-emergency-orange hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'}`}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              <button disabled={isPlaying || isFinished || frames.length === 0} onClick={stepForward} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white disabled:opacity-50" title="Step Forward"><StepForward size={20} /></button>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-300">
                Step: {frames.length > 0 ? currentFrameIndex + 1 : 0} / {frames.length}
              </p>
            </div>
          </div>
        </div>

        {/* Live Information & Education Panel */}
        <div className="xl:col-span-1 flex flex-col space-y-6">
          
          {/* Education Panel */}
          <div className="glass-panel p-6 flex-1 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Info size={100} />
            </div>
            <h3 className="text-lg font-bold flex items-center space-x-2 mb-4 text-emergency-accent-blue relative z-10">
              <Info size={20} />
              <span>Education Panel</span>
            </h3>
            
            <div className="bg-slate-900/50 p-5 rounded-lg border border-white/5 flex-1 flex items-center justify-center relative z-10">
              <p className="text-sm leading-relaxed text-gray-200 text-center font-medium">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentFrame?.explanation || 'empty'}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="block"
                  >
                    {currentFrame?.explanation || 'Select an algorithm, enter a target quantity, and click Find to begin the visualization.'}
                  </motion.span>
                </AnimatePresence>
              </p>
            </div>
          </div>

          {/* Live Information Panel */}
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold flex items-center space-x-2 mb-6 text-green-400">
              <Database size={20} />
              <span>Live Information</span>
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-sm text-gray-400">Algorithm</span>
                <span className="font-mono text-sm text-white">{selectedAlgo} Search</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-sm text-gray-400">Comparisons</span>
                <span className="font-mono font-bold text-white">
                  {currentFrame?.comparisons ?? 0}
                  {isFinished && ` / ${totalComparisons}`}
                </span>
              </div>
              {selectedAlgo === 'Binary' && currentFrame && (
                <>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-sm text-gray-400">Low / Mid / High</span>
                    <span className="font-mono text-sm">
                      <span className="text-blue-400">{currentFrame.lowPointer ?? '-'}</span> / 
                      <span className="text-orange-400 mx-1">{currentFrame.midPointer ?? '-'}</span> / 
                      <span className="text-red-400">{currentFrame.highPointer ?? '-'}</span>
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-sm text-gray-400">Search Range</span>
                <span className="font-mono text-sm text-gray-300">
                  {currentFrame?.searchRange ? `[${currentFrame.searchRange[0]} ... ${currentFrame.searchRange[1]}]` : `[0 ... ${data.length - 1}]`}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-sm text-gray-400">Execution Time</span>
                <span className="font-mono text-sm text-emergency-accent-blue">
                  {isFinished ? `${executionTimeMs.toFixed(2)} ms` : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-gray-400">Status</span>
                <span className={`font-mono font-bold ${
                  currentFrame?.found 
                    ? 'text-green-400' 
                    : isFinished && !currentFrame?.found 
                      ? 'text-red-400' 
                      : 'text-yellow-400'
                }`}>
                  {currentFrame?.found ? 'Found' : isFinished ? 'Not Found' : isPlaying ? 'Searching...' : 'Idle'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
