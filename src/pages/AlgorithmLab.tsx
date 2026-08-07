import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Play, Award, Zap, Database, Clock, RefreshCcw, Search, ArrowDownUp } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function AlgorithmLab() {
  const { allocationLogs } = useAppContext();
  
  // Get the most recent successful log
  const latestLog = allocationLogs.find(log => log.status === 'SUCCESS');

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Mission Replay Engine</h2>
          <p className="text-gray-400 text-sm">Analyze the backend DSA execution of the latest mission allocation.</p>
        </div>
      </div>

      {!latestLog ? (
        <div className="glass-panel p-12 text-center text-gray-400 flex flex-col items-center justify-center">
          <Database size={48} className="mb-4 opacity-20" />
          <h3 className="text-xl font-bold mb-2">No Allocations Found</h3>
          <p>Please go to the Emergency Missions page and allocate a pending mission to view its algorithmic replay.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
              <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                <Search size={16} /> Search Execution
              </h3>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-white">{latestLog.dsaStats.searchAlgorithm}</span>
              </div>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Target Resource</span>
                  <span className="text-blue-400">{latestLog.message.split(' ')[2] || 'Resource'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Execution Time</span>
                  <span className="text-white">{latestLog.dsaStats.executionTimeMs}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Complexity</span>
                  <span className="text-emerald-400">O(N)</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-6 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
              <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                <ArrowDownUp size={16} /> Sort Execution
              </h3>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-white">{latestLog.dsaStats.sortAlgorithm}</span>
              </div>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Sorted By</span>
                  <span className="text-emerald-400">Capacity (Descending)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Comparisons</span>
                  <span className="text-white">{latestLog.dsaStats.comparisons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Complexity</span>
                  <span className="text-emerald-400">O(N log N)</span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6"
          >
            <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
              <Database size={16} /> Resulting Sorted Array (Relief Centers)
            </h3>
            
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4 w-max">
                {latestLog.dsaStats.sortedCenters?.map((center, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + (idx * 0.05) }}
                    key={center.id} 
                    className={clsx(
                      "flex flex-col items-center justify-center p-4 rounded-xl border w-40 h-32 relative",
                      center.id === latestLog.assignedCenterId 
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]" 
                        : "bg-black/40 border-white/10 text-gray-400"
                    )}
                  >
                    {center.id === latestLog.assignedCenterId && (
                      <div className="absolute -top-2 -right-2 bg-emerald-500 text-black text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <Award size={12} /> Winner
                      </div>
                    )}
                    <span className="font-mono text-xs opacity-50 mb-2">Index {idx}</span>
                    <span className="text-center text-sm font-bold truncate w-full px-2 mb-2">{center.name}</span>
                    <span className="font-mono font-bold text-lg">{center.capacity}</span>
                    <span className="text-[10px] uppercase">Capacity</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 font-mono">
              * Centers are ranked strictly by total capacity to fulfill the largest resource requests rapidly. 
              The system scans this sorted array using Linear Search to find the first center matching the request criteria.
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
