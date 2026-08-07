import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  Swap, Warning, MagnifyingGlass, ArrowsDownUp, Buildings, Truck, CheckCircle,
  Cpu, Heartbeat, Lightning, Play, Info
} from '@phosphor-icons/react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  { id: 'request', label: 'Incoming Request', icon: <Warning size={24} weight="light" /> },
  { id: 'search', label: 'Searching Resources', icon: <MagnifyingGlass size={24} weight="light" /> },
  { id: 'sort', label: 'Sorting Available Resources', icon: <ArrowsDownUp size={24} weight="light" /> },
  { id: 'center', label: 'Selecting Relief Center', icon: <Buildings size={24} weight="light" /> },
  { id: 'dispatch', label: 'Dispatching Resources', icon: <Truck size={24} weight="light" /> },
  { id: 'complete', label: 'Mission Completed', icon: <CheckCircle size={24} weight="light" /> },
];

export default function ResourceAllocation() {
  const { missions, setMissions } = useAppContext();
  
  const [activeStep, setActiveStep] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentRequestIndex, setCurrentRequestIndex] = useState(0);

  const pendingRequests = missions.filter(r => r.status === 'Pending');
  const currentReq = pendingRequests[currentRequestIndex];

  const handleProcess = () => {
    if (!currentReq || isProcessing) return;
    setIsProcessing(true);
    setActiveStep(0);

    const timeouts = [
      setTimeout(() => setActiveStep(1), 1200), // Search
      setTimeout(() => setActiveStep(2), 2800), // Sort
      setTimeout(() => setActiveStep(3), 4500), // Select Center
      setTimeout(() => setActiveStep(4), 6200), // Dispatch
      setTimeout(() => {
        setActiveStep(5); // Complete
        setIsProcessing(false);
        setMissions(prev => prev.map(r => r.missionId === currentReq.missionId ? { ...r, status: 'Completed' } : r));
      }, 8500),
    ];

    return () => timeouts.forEach(clearTimeout);
  };

  const getDsaInfo = (stepId: string) => {
    switch (stepId) {
      case 'search':
        return { algo: 'Linear Search', time: '1.2ms', comps: '2,405', complexity: 'O(N)' };
      case 'sort':
        return { algo: 'Quick Sort', time: '4.8ms', comps: '15,200', complexity: 'O(N log N)' };
      case 'center':
        return { algo: 'Graph BFS (Shortest Path)', time: '8.4ms', comps: '342', complexity: 'O(V + E)' };
      default:
        return null;
    }
  };

  return (
    <div className="space-y-12 font-sans max-w-[1600px] mx-auto pb-24">
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold bg-white/5 border border-white/10 mb-6 text-gray-400">
          <Swap size={12} weight="light" className="mr-2" /> Automated Dispatch
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tighter">Resource Allocation</h2>
        <p className="text-gray-400 text-base max-w-2xl leading-relaxed">
          Automatically assign available resources based on priority and availability using our high-performance Data Structures & Algorithms (DSA) engine.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Workflow Visualizer (Span 8) */}
        <motion.div 
          initial={{ opacity: 0, y: 30, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.2 }}
          className="lg:col-span-8 glass-panel p-2 flex flex-col"
        >
          <div className="glass-inner rounded-[calc(2rem-0.5rem)] p-8 md:p-12 relative overflow-hidden flex-1 h-full">
            
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] opacity-[0.03] pointer-events-none rotate-12">
              <Cpu size={400} weight="thin" />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 relative z-10 gap-6">
              <h3 className="text-2xl font-bold text-white flex items-center tracking-tight">
                <Swap className="mr-3 text-blue-400" size={28} weight="light" /> 
                Allocation Workflow
              </h3>
              
              <button 
                onClick={handleProcess}
                disabled={isProcessing || !currentReq}
                className={clsx(
                  "group px-8 py-4 rounded-full font-bold flex items-center space-x-3 transition-all duration-500 shadow-xl active:scale-[0.98]",
                  isProcessing ? "bg-white/5 text-gray-500 cursor-not-allowed border border-white/5" :
                  !currentReq ? "bg-white/5 text-gray-500 cursor-not-allowed border border-white/5" :
                  "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                )}
              >
                {isProcessing ? <Heartbeat size={20} weight="light" className="animate-spin" /> : <Play size={20} weight="fill" />}
                <span className="tracking-wide text-sm uppercase">{isProcessing ? 'Processing Engine...' : 'Process Next Request'}</span>
              </button>
            </div>

            <div className="relative z-10 py-4 max-w-2xl mx-auto w-full pl-4 md:pl-12">
              {/* Connecting Line */}
              <div className="absolute left-[39px] md:left-[71px] top-12 bottom-12 w-0.5 bg-white/5 rounded-full" />
              
              {/* Animated Progress Line */}
              <motion.div 
                className="absolute left-[39px] md:left-[71px] top-12 w-0.5 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                initial={{ height: 0 }}
                animate={{ height: activeStep >= 0 ? `${(activeStep / (steps.length - 1)) * 100}%` : '0%' }}
                transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
              />

              <div className="space-y-12 relative">
                {steps.map((step, index) => {
                  const isActive = activeStep === index;
                  const isPast = activeStep > index;
                  const dsaInfo = getDsaInfo(step.id);

                  return (
                    <div key={step.id} className="flex items-start">
                      <motion.div 
                        animate={{ 
                          scale: isActive ? 1.1 : 1,
                          backgroundColor: isActive ? 'rgba(59,130,246,1)' : isPast ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)',
                          borderColor: isActive ? 'rgba(59,130,246,1)' : isPast ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
                          color: isActive ? '#fff' : isPast ? 'rgb(96,165,250)' : 'rgba(255,255,255,0.3)'
                        }}
                        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                        className={clsx(
                          "w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shrink-0 z-10 border shadow-lg backdrop-blur-md"
                        )}
                      >
                        {step.icon}
                      </motion.div>
                      
                      <div className="ml-6 md:ml-10 flex-1 pt-2 md:pt-4">
                        <motion.h4 
                          animate={{ 
                            color: isActive ? '#fff' : isPast ? 'rgb(148,163,184)' : 'rgba(255,255,255,0.3)'
                          }}
                          className="text-xl md:text-2xl font-bold tracking-tight"
                        >
                          {step.label}
                        </motion.h4>
                        
                        <AnimatePresence>
                          {isActive && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0, filter: 'blur(5px)' }}
                              animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)' }}
                              exit={{ opacity: 0, height: 0, filter: 'blur(5px)' }}
                              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                              className="mt-4 overflow-hidden"
                            >
                              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                                {step.id === 'request' && currentReq && `Received request ${currentReq.missionId} for ${currentReq.requestedResource}.`}
                                {step.id === 'search' && "Scanning global inventory for available items..."}
                                {step.id === 'sort' && "Prioritizing resources based on urgency and distance..."}
                                {step.id === 'center' && "Identifying nearest capable relief center..."}
                                {step.id === 'dispatch' && "Initiating automated dispatch protocols..."}
                                {step.id === 'complete' && <span className="text-emerald-400 font-bold">Resources allocated successfully.</span>}
                              </p>

                              {dsaInfo && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.3, duration: 0.6 }}
                                  className="mt-6 bg-white/[0.02] border border-white/[0.05] rounded-xl p-5 md:p-6"
                                >
                                  <div className="flex items-center space-x-2 text-blue-400 font-bold mb-6 text-[10px] uppercase tracking-widest">
                                    <Lightning size={14} weight="fill" className="animate-pulse" /> 
                                    <span>Algorithm Execution Details</span>
                                  </div>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div>
                                      <p className="text-gray-500 text-[9px] uppercase font-bold mb-2 tracking-widest">Algorithm Used</p>
                                      <p className="text-white font-mono text-sm">{dsaInfo.algo}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-[9px] uppercase font-bold mb-2 tracking-widest">Time Complexity</p>
                                      <p className="text-emerald-400 font-mono text-sm bg-emerald-500/10 px-2 py-1 rounded w-max">{dsaInfo.complexity}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-[9px] uppercase font-bold mb-2 tracking-widest">Execution Time</p>
                                      <p className="text-white font-mono text-sm">{dsaInfo.time}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 text-[9px] uppercase font-bold mb-2 tracking-widest">Comparisons</p>
                                      <p className="text-white font-mono text-sm">{dsaInfo.comps}</p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Pending Queue (Span 4) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.4 }}
          className="lg:col-span-4 flex flex-col space-y-6"
        >
          <div className="glass-panel p-1.5 flex-1 h-full">
            <div className="glass-inner rounded-[calc(2rem-0.375rem)] p-8 h-full flex flex-col">
              <h3 className="text-xl font-bold text-white flex items-center mb-8 tracking-tight">
                <Warning className="mr-3 text-orange-400" size={24} weight="light" />
                Pending Queue
              </h3>
              
              <div className="flex-1">
                {!currentReq ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 py-20">
                    <CheckCircle size={64} weight="light" className="mb-6 opacity-20 text-emerald-500" />
                    <p className="text-xl font-medium text-gray-400">All caught up!</p>
                    <p className="text-sm mt-2">No pending requests.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map((req, i) => (
                      <motion.div 
                        key={req.missionId} 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className={clsx(
                          "p-5 rounded-2xl border transition-all duration-500",
                          i === currentRequestIndex 
                            ? "bg-blue-500/10 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)]" 
                            : "bg-white/[0.02] border-white/5 opacity-50"
                        )}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-base font-bold text-gray-200 font-mono tracking-tight">{req.missionId}</span>
                          <span className={clsx(
                            "text-[9px] uppercase font-bold px-3 py-1 rounded-full tracking-widest border",
                            req.priority === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                          )}>{req.priority}</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-3 font-mono">{req.region} • {req.disasterType}</p>
                        <p className="text-sm font-medium text-blue-300">Requires: {req.requiredQuantity}x <span className="font-bold text-white">{req.requestedResource}</span></p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-8 p-5 bg-white/[0.02] border border-white/[0.05] rounded-xl flex items-start space-x-4 text-gray-400 text-xs leading-relaxed">
                <Info size={20} weight="light" className="shrink-0 text-blue-400" />
                <p>
                  The allocation engine processes the queue sequentially. It utilizes backend DSA microservices to search the global inventory and route items from the optimal relief center.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
