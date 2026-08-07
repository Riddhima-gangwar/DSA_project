import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Warning, MapPin, Clock, Package, Users, ShieldWarning, CheckCircle, ClockCounterClockwise, WarningCircle, Lightning, Truck, MagnifyingGlass as Search, ArrowsDownUp as ArrowDownUp } from '@phosphor-icons/react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function DisasterRequests() {
  const { missions, isEmergencyMode, processMission } = useAppContext();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'High': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <ClockCounterClockwise size={16} weight="bold" className="text-gray-400" />;
      case 'Searching': return <Search size={16} weight="bold" className="text-blue-400 animate-pulse" />;
      case 'Sorting': return <ArrowDownUp size={16} weight="bold" className="text-purple-400 animate-pulse" />;
      case 'Allocating': return <WarningCircle size={16} weight="bold" className="text-orange-400 animate-pulse" />;
      case 'Dispatching': return <Truck size={16} weight="bold" className="text-yellow-400 animate-pulse" />;
      case 'Completed': return <CheckCircle size={16} weight="bold" className="text-emerald-400" />;
      default: return <ShieldWarning size={16} weight="bold" />;
    }
  };

  const handleProcess = async (missionId: string) => {
    setProcessingId(missionId);
    await processMission(missionId);
    setProcessingId(null);
  };

  return (
    <div className="space-y-12 font-sans max-w-[1600px] mx-auto pb-24">
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold bg-white/5 border border-white/10 mb-6 text-gray-400">
          <Warning size={12} weight="light" className="mr-2" /> Live Missions
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tighter">Emergency Missions</h2>
        <p className="text-gray-400 text-base max-w-2xl leading-relaxed">
          Track incoming emergency alerts. Trigger the DSA engine to automatically run search and sort algorithms, allocate optimal resources, and dispatch relief centers.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.2 }}
        className="glass-panel p-2 flex flex-col overflow-hidden"
      >
        <div className="glass-inner rounded-[calc(2rem-0.5rem)] flex flex-col h-full overflow-hidden">
          <div className="overflow-x-auto min-h-[500px]">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest font-bold text-gray-500">
                  <th className="p-6">Mission ID</th>
                  <th className="p-6">Disaster Type</th>
                  <th className="p-6">Affected Region</th>
                  <th className="p-6">Population</th>
                  <th className="p-6">Required Resource</th>
                  <th className="p-6">Quantity</th>
                  <th className="p-6">Priority</th>
                  <th className="p-6">Phase</th>
                  <th className="p-6">Assigned Center</th>
                  <th className="p-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {missions.map((mission, index) => {
                    const isProcessing = processingId === mission.missionId || (mission.status !== 'Pending' && mission.status !== 'Completed');
                    return (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                        key={mission.missionId} 
                        className={clsx(
                          "border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group cursor-default",
                          mission.priority === 'Critical' && isEmergencyMode ? 'bg-red-900/10' : '',
                          isProcessing ? 'bg-blue-900/10 border-blue-500/20' : ''
                        )}
                      >
                        <td className="p-6 font-mono text-xs font-bold text-gray-500">{mission.missionId}</td>
                        <td className="p-6 font-semibold text-sm text-gray-200 group-hover:text-white transition-colors">{mission.disasterType}</td>
                        <td className="p-6">
                          <span className="flex items-center text-xs text-gray-400 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full w-max">
                            <MapPin size={12} weight="fill" className="mr-1.5 text-blue-400/50" />
                            {mission.region}
                          </span>
                        </td>
                        <td className="p-6">
                          <span className="flex items-center text-xs text-gray-400 w-max">
                            <Users size={12} weight="light" className="mr-1.5 opacity-50 text-gray-400" />
                            {mission.population?.toLocaleString() || 'Unknown'}
                          </span>
                        </td>
                        <td className="p-6">
                          <span className="flex items-center text-xs text-gray-300 w-max font-semibold">
                            <Package size={14} weight="light" className="mr-1.5 text-blue-400" />
                            {mission.requestedResource}
                          </span>
                        </td>
                        <td className="p-6 font-mono text-sm font-bold text-gray-200">{mission.requiredQuantity.toLocaleString()}</td>
                        <td className="p-6">
                          <span className={clsx("px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest border", getUrgencyColor(mission.priority))}>
                            {mission.priority}
                          </span>
                        </td>
                        <td className="p-6">
                          <span className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider">
                            {getStatusIcon(mission.status)}
                            <span className={clsx(
                              mission.status === 'Completed' ? 'text-emerald-400' :
                              mission.status === 'Pending' ? 'text-gray-400' : 'text-blue-400'
                            )}>
                              {mission.status}
                            </span>
                          </span>
                        </td>
                        <td className="p-6 text-xs font-mono text-gray-500">
                          {mission.assignedReliefCenter || <span className="opacity-50">Unassigned</span>}
                        </td>
                        <td className="p-6 text-right">
                          {mission.status === 'Pending' ? (
                            <button
                              onClick={() => handleProcess(mission.missionId)}
                              disabled={processingId !== null}
                              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(59,130,246,0.3)] disabled:shadow-none transition-all flex items-center gap-2 ml-auto"
                            >
                              <Lightning size={14} weight="fill" />
                              Allocate
                            </button>
                          ) : isProcessing ? (
                            <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2 overflow-hidden max-w-[100px] ml-auto">
                               <div className="bg-blue-500 h-1.5 rounded-full shadow-[0_0_10px_#3b82f6] transition-all duration-500" style={{ width: `${mission.progressPercentage}%` }} />
                            </div>
                          ) : (
                            <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded">Done</span>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
            
            {missions.length === 0 && (
              <div className="p-24 flex flex-col items-center justify-center text-gray-500">
                <Warning size={64} weight="light" className="mb-6 opacity-20" />
                <p className="text-xl font-medium text-gray-400">No missions found</p>
                <p className="text-sm mt-2">All regions are currently stable.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
