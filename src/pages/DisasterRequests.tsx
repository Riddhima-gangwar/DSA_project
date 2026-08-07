import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Warning, MapPin, Clock, Package, Users, ShieldWarning, CheckCircle, ClockCounterClockwise, WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export default function DisasterRequests() {
  const { requests, isEmergencyMode } = useAppContext();

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
      case 'Pending': return <ClockCounterClockwise size={16} weight="bold" className="text-orange-400" />;
      case 'In Progress': return <WarningCircle size={16} weight="bold" className="text-blue-400 animate-pulse" />;
      case 'Fulfilled': return <CheckCircle size={16} weight="bold" className="text-emerald-400" />;
      default: return <ShieldWarning size={16} weight="bold" />;
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
          <Warning size={12} weight="light" className="mr-2" /> Live Requests
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tighter">Disaster Requests</h2>
        <p className="text-gray-400 text-base max-w-2xl leading-relaxed">
          Track incoming emergency requests from affected regions. Monitor urgency levels, required resources, and fulfillment status in real-time.
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
                  <th className="p-6">Request ID</th>
                  <th className="p-6">Disaster Type</th>
                  <th className="p-6">Affected Region</th>
                  <th className="p-6">Population</th>
                  <th className="p-6">Requested Resource</th>
                  <th className="p-6">Quantity</th>
                  <th className="p-6">Priority</th>
                  <th className="p-6">Request Time</th>
                  <th className="p-6">Status</th>
                  <th className="p-6">Assigned Center</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ delay: index * 0.05, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                    key={req.id} 
                    className={clsx(
                      "border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group cursor-default",
                      req.urgency === 'Critical' && isEmergencyMode ? 'bg-red-900/10' : ''
                    )}
                  >
                    <td className="p-6 font-mono text-xs font-bold text-gray-500">{req.id}</td>
                    <td className="p-6 font-semibold text-sm text-gray-200 group-hover:text-white transition-colors">{req.disasterType}</td>
                    <td className="p-6">
                      <span className="flex items-center text-xs text-gray-400 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full w-max">
                        <MapPin size={12} weight="fill" className="mr-1.5 text-blue-400/50" />
                        {req.region}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className="flex items-center text-xs text-gray-400 w-max">
                        <Users size={12} weight="light" className="mr-1.5 opacity-50 text-gray-400" />
                        {req.population?.toLocaleString() || 'Unknown'}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className="flex items-center text-xs text-gray-300 w-max font-semibold">
                        <Package size={14} weight="light" className="mr-1.5 text-blue-400" />
                        {req.requestedResource}
                      </span>
                    </td>
                    <td className="p-6 font-mono text-sm font-bold text-gray-200">{req.quantity.toLocaleString()}</td>
                    <td className="p-6">
                      <span className={clsx("px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest border", getUrgencyColor(req.urgency))}>
                        {req.urgency}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className="flex items-center text-xs text-gray-500 font-mono bg-white/5 border border-white/5 px-3 py-1.5 rounded-full w-max">
                        <Clock size={12} weight="light" className="mr-1.5 opacity-50" />
                        {new Date(req.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider">
                        {getStatusIcon(req.status)}
                        <span className={clsx(
                          req.status === 'Pending' ? 'text-orange-400' :
                          req.status === 'In Progress' ? 'text-blue-400' :
                          'text-emerald-400'
                        )}>
                          {req.status}
                        </span>
                      </span>
                    </td>
                    <td className="p-6 text-xs font-mono text-gray-500">
                      {req.assignedReliefCenter || <span className="opacity-50">Unassigned</span>}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            {requests.length === 0 && (
              <div className="p-24 flex flex-col items-center justify-center text-gray-500">
                <Warning size={64} weight="light" className="mb-6 opacity-20" />
                <p className="text-xl font-medium text-gray-400">No requests found</p>
                <p className="text-sm mt-2">All regions are currently stable.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
