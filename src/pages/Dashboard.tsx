import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Activity, Package, MapPin, 
  Truck, Users, AlertCircle, CheckCircle,
  Radio, FileText, Search, ArrowDownUp, Handshake, 
  Cpu, Droplets, Utensils, Pill, Home, Fuel, LifeBuoy,
  Clock, Map as MapIcon, Building
} from 'lucide-react';

export default function Dashboard() {
  const { isEmergencyMode, resources, missions, centers, systemEvents, allocationLogs } = useAppContext();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Theme colors based on mode
  const theme = isEmergencyMode 
    ? { primary: 'red', text: 'text-red-500', bg: 'bg-red-500', shadow: 'shadow-[0_0_30px_rgba(239,68,68,0.3)]', border: 'border-red-500/30' }
    : { primary: 'blue', text: 'text-blue-500', bg: 'bg-blue-500', shadow: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]', border: 'border-blue-500/30' };

  // Calculate KPIs
  const totalMissions = missions.length;
  const completedMissions = missions.filter(m => m.status === 'Completed').length;
  const missionProgress = totalMissions === 0 ? 0 : Math.round((completedMissions / totalMissions) * 100);
  
  const activeEmergencies = missions.filter(m => m.status !== 'Completed').length;
  const criticalMissions = missions.filter(m => m.priority === 'Critical' && m.status !== 'Completed').length;
  
  const totalAvailableResources = resources.filter(r => r.status === 'Available').reduce((acc, curr) => acc + curr.quantity, 0);
  const totalCenters = centers.filter(c => c.status === 'Active').length;
  const dispatchVehicles = centers.reduce((acc, curr) => acc + curr.vehicles, 0);
  const rescueTeams = centers.reduce((acc, curr) => acc + (curr.personnel / 10), 0);
  const lowStockAlerts = resources.filter(r => r.quantity > 0 && r.quantity < 50).length;
  const allocationSuccess = allocationLogs.length === 0 ? 100 : Math.round((allocationLogs.filter(l => l.status === 'SUCCESS').length / allocationLogs.length) * 100);

  const activeMission = missions.find(m => m.status !== 'Completed' && m.status !== 'Pending');
  const displayMission = activeMission || missions[0];

  const getTimelineSteps = () => {
    const currentPhase = activeMission?.status || 'Pending';
    const activeIndex = ['Pending', 'Searching', 'Sorting', 'Allocating', 'Dispatching', 'Completed'].indexOf(currentPhase);
    
    return [
      { icon: FileText, label: 'Pending', active: activeIndex >= 0, pulse: currentPhase === 'Pending' },
      { icon: Search, label: 'Search', active: activeIndex >= 1, pulse: currentPhase === 'Searching' },
      { icon: ArrowDownUp, label: 'Sort', active: activeIndex >= 2, pulse: currentPhase === 'Sorting' },
      { icon: Handshake, label: 'Allocate', active: activeIndex >= 3, pulse: currentPhase === 'Allocating' },
      { icon: Truck, label: 'Dispatch', active: activeIndex >= 4, pulse: currentPhase === 'Dispatching' },
      { icon: CheckCircle, label: 'Complete', active: activeIndex >= 5, pulse: false },
    ];
  };

  const timelineSteps = getTimelineSteps();
  const currentProgressLine = (timelineSteps.filter(s => s.active).length / timelineSteps.length) * 100;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Active Disaster Command Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={clsx(
          "w-full rounded-2xl border bg-black/40 backdrop-blur-xl overflow-hidden relative",
          theme.border, theme.shadow
        )}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50" />
        <div className={clsx(
          "absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none",
          theme.bg
        )} />
        
        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="flex items-start gap-6">
            <div className={clsx(
              "w-16 h-16 rounded-xl flex items-center justify-center border bg-black/50 backdrop-blur-md shrink-0 transition-colors",
              theme.border, theme.text
            )}>
              <AlertTriangle size={32} className={activeEmergencies > 0 ? "animate-pulse" : ""} />
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={clsx("px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border transition-colors", theme.border, theme.text, "bg-black/50")}>
                  {displayMission ? `Mission: ${displayMission.missionId}` : 'System Standby'}
                </span>
                <span className="text-gray-400 text-xs font-mono flex items-center gap-1">
                  <Clock size={12} /> Last Updated: {time.toLocaleTimeString()}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">
                {displayMission ? `${displayMission.disasterType} IN ${displayMission.region}` : 'NO ACTIVE THREATS'}
              </h2>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm font-mono text-gray-400">
                <span className="flex items-center gap-1"><MapPin size={14} className={theme.text}/> {displayMission?.region || 'Global'}</span>
                <span className="text-gray-600">|</span>
                <span className="flex items-center gap-1"><Users size={14} className={theme.text}/> Pop. Affected: {displayMission?.population.toLocaleString() || '0'}</span>
                <span className="text-gray-600">|</span>
                <span className="flex items-center gap-1"><Activity size={14} className={theme.text}/> Status: {displayMission?.status || 'Monitoring'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-start md:items-end md:border-l border-white/10 md:pl-6 h-full justify-center w-full md:w-auto">
            <p className="text-gray-500 text-[10px] font-mono uppercase tracking-widest mb-1">Global Status</p>
            <p className={clsx("text-2xl font-bold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r transition-colors", 
              activeEmergencies > 0 ? "from-red-400 to-orange-400" : "from-blue-400 to-cyan-400"
            )}>
              {activeEmergencies > 0 ? 'ACTIVE RESPONSE' : 'STANDBY'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Emergency Response Timeline */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full rounded-xl border border-white/5 bg-black/20 p-6 backdrop-blur-sm overflow-x-auto"
      >
        <div className="flex items-center justify-between relative min-w-[700px]">
          <div className="absolute left-[5%] right-[5%] top-5 h-0.5 bg-gray-800 z-0" />
          <div className={clsx(
            "absolute left-[5%] top-5 h-0.5 z-0 transition-all duration-1000",
            activeMission ? "bg-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-gray-700"
          )} style={{ width: `${currentProgressLine - 10}%` }} />
          
          {timelineSteps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center gap-3 w-20">
              <div className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center border transition-colors",
                step.active ? "bg-blue-900/50 border-blue-400 text-blue-400" : "bg-black border-gray-700 text-gray-500",
                step.pulse ? "animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)]" : ""
              )}>
                <step.icon size={18} />
              </div>
              <span className={clsx("text-[10px] font-mono uppercase tracking-wider text-center", step.active ? "text-blue-300" : "text-gray-600")}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* KPI Cards (8 Grid) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Active Missions" value={activeEmergencies.toString().padStart(2, '0')} icon={Activity} color={activeEmergencies > 0 ? "red" : "blue"} delay={0.1} />
        <KPICard title="Critical Missions" value={criticalMissions.toString().padStart(2, '0')} icon={AlertCircle} color={criticalMissions > 0 ? "orange" : "blue"} delay={0.2} />
        <KPICard title="Available Resources" value={totalAvailableResources >= 1000 ? `${(totalAvailableResources / 1000).toFixed(1)}K` : totalAvailableResources.toString()} icon={Package} color="emerald" delay={0.3} />
        <KPICard title="Relief Centers" value={totalCenters.toString()} icon={Building} color="blue" delay={0.4} />
        <KPICard title="Dispatch Vehicles" value={dispatchVehicles.toString()} icon={Truck} color="blue" delay={0.5} />
        <KPICard title="Rescue Teams" value={Math.floor(rescueTeams).toString()} icon={Users} color="emerald" delay={0.6} />
        <KPICard title="Low Stock Alerts" value={lowStockAlerts.toString().padStart(2, '0')} icon={AlertTriangle} color={lowStockAlerts > 0 ? "red" : "blue"} delay={0.7} />
        <KPICard title="Allocation Success" value={`${allocationSuccess}%`} icon={CheckCircle} color="emerald" delay={0.8} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Span 8) */}
        <div className="lg:col-span-8 space-y-6 flex flex-col">
          
          {/* Interactive India Map & Operations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            {/* India Map Mock */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-white/5 bg-black/40 backdrop-blur-md p-6 flex flex-col relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4 relative z-10">
                <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <MapIcon size={16} /> Regional Overview
                </h3>
                <span className={clsx("w-2 h-2 rounded-full", activeEmergencies > 0 ? "bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" : "bg-blue-500")}></span>
              </div>
              <div className="flex-1 flex items-center justify-center relative min-h-[300px]">
                <svg viewBox="0 0 400 450" className={clsx("w-full h-full max-h-[350px] opacity-20 filter transition-colors", activeEmergencies > 0 ? "drop-shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "drop-shadow-[0_0_15px_rgba(59,130,246,0.2)]")}>
                  <path d="M 150 50 L 200 10 L 250 50 L 300 150 L 380 200 L 350 300 L 250 400 L 200 440 L 150 400 L 100 350 L 50 250 L 80 150 Z" 
                        fill="none" stroke={activeEmergencies > 0 ? "#ef4444" : "#3b82f6"} strokeWidth="2" strokeDasharray="4 4" />
                </svg>
                <div className="absolute inset-0 rounded-full border border-blue-500/10 scale-[1.5] animate-[spin_4s_linear_infinite]" 
                     style={{ background: `conic-gradient(from 0deg, transparent 70%, ${activeEmergencies > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)'} 100%)` }} />
                
                {/* Disaster Pins based on active missions */}
                {missions.filter(m => m.status !== 'Completed').map((mission, idx) => (
                   <div key={mission.missionId} className="absolute" style={{ top: `${40 + (idx * 10)}%`, right: `${30 + (idx * 15)}%` }}>
                     <div className="relative">
                       <div className="w-4 h-4 bg-red-500 rounded-full animate-ping absolute -top-1 -left-1" />
                       <div className="w-2 h-2 bg-red-500 rounded-full relative z-10" />
                     </div>
                   </div>
                ))}
              </div>
            </motion.div>

            {/* Live Operations Feed */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl border border-white/5 bg-black/40 backdrop-blur-md p-6 flex flex-col"
            >
              <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                <Activity size={16} /> Live Operations Feed
              </h3>
              <div className="space-y-3 overflow-y-auto pr-2 max-h-[300px] scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                <AnimatePresence>
                  {systemEvents.length === 0 ? (
                    <div className="text-gray-500 text-xs italic">System monitoring online. No events yet.</div>
                  ) : systemEvents.map((evt) => (
                    <motion.div 
                      key={evt.id}
                      initial={{ opacity: 0, x: -10, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.05] transition-colors"
                    >
                      <div className="text-[10px] font-mono text-gray-500 mt-0.5 shrink-0">{new Date(evt.timestamp).toLocaleTimeString()}</div>
                      <div>
                        <div className={clsx(
                          "text-[9px] uppercase tracking-wider font-bold mb-0.5",
                          evt.priority === 'Critical' ? 'text-red-400' :
                          evt.type === 'DISPATCH' ? 'text-blue-400' :
                          evt.type === 'SUCCESS' ? 'text-emerald-400' : 'text-orange-400'
                        )}>
                          {evt.type}
                        </div>
                        <div className="text-xs text-gray-300">{evt.message}</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Recent Emergency Missions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border border-white/5 bg-black/40 backdrop-blur-md p-6"
          >
            <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-6">
              <FileText size={16} /> Recent Emergency Missions
            </h3>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[600px]">
                <thead>
                  <tr className="text-gray-500 font-mono text-xs uppercase border-b border-white/10">
                    <th className="pb-3 font-normal px-2">Mission ID</th>
                    <th className="pb-3 font-normal px-2">Location</th>
                    <th className="pb-3 font-normal px-2">Resource Needed</th>
                    <th className="pb-3 font-normal px-2">Priority</th>
                    <th className="pb-3 font-normal px-2">Phase</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {missions.slice(0, 5).map((mission) => (
                    <tr key={mission.missionId} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-2 font-mono text-gray-500">{mission.missionId}</td>
                      <td className="py-3 px-2">{mission.region}</td>
                      <td className="py-3 px-2">{mission.requestedResource}</td>
                      <td className="py-3 px-2">
                        <span className={clsx("text-xs px-2 py-1 rounded bg-black border font-medium", 
                          mission.priority === 'Critical' ? "text-red-400 border-red-500/30" : 
                          mission.priority === 'High' ? "text-orange-400 border-orange-500/30" : "text-yellow-400 border-yellow-500/30"
                        )}>
                          {mission.priority}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={clsx("text-xs font-mono",
                          mission.status === 'Completed' ? 'text-emerald-400' :
                          mission.status === 'Pending' ? 'text-gray-400' :
                          'text-orange-400 animate-pulse'
                        )}>
                          [{mission.status.toUpperCase()}]
                        </span>
                      </td>
                    </tr>
                  ))}
                  {missions.length === 0 && (
                     <tr>
                       <td colSpan={5} className="py-8 text-center text-gray-500 text-xs">No missions active</td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Right Column (Span 4) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          
          {/* Mission Progress */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-white/5 bg-black/40 backdrop-blur-md p-6 flex flex-col items-center justify-center relative overflow-hidden"
          >
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-blue-500/10 rounded-full blur-[30px]" />
            <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest self-start mb-6 w-full flex items-center gap-2">
               <Activity size={16} /> Global Progress
            </h3>
            
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke={missionProgress > 0 ? "#3b82f6" : "#6b7280"} strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * missionProgress / 100)} strokeLinecap="round" className={missionProgress > 0 ? "drop-shadow-[0_0_8px_#3b82f6] transition-all duration-1000" : "transition-all duration-1000"} />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold text-white tracking-tighter">{missionProgress}%</span>
                <span className="text-[10px] font-mono text-blue-400 uppercase">Completed</span>
              </div>
            </div>
            
            <div className="w-full mt-6 grid grid-cols-2 gap-4 text-center">
              <div className="bg-black/50 p-2 rounded border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase font-mono mb-1">Target</p>
                <p className="text-lg text-white font-mono">100%</p>
              </div>
              <div className="bg-black/50 p-2 rounded border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase font-mono mb-1">ETA</p>
                <p className="text-lg text-blue-400 font-mono">{activeEmergencies > 0 ? '4h 12m' : '--:--'}</p>
              </div>
            </div>
          </motion.div>

          {/* Resource Distribution */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border border-white/5 bg-black/40 backdrop-blur-md p-6 flex-1"
          >
            <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-6">
              <Package size={16} /> Resource Distribution
            </h3>
            <div className="space-y-5">
              {[
                { label: 'Water', icon: Droplets, val: 85, color: 'bg-blue-400' },
                { label: 'Food', icon: Utensils, val: 65, color: 'bg-emerald-400' },
                { label: 'Medicine', icon: Pill, val: 40, color: 'bg-red-400' },
                { label: 'Shelter', icon: Home, val: 55, color: 'bg-orange-400' },
                { label: 'Fuel', icon: Fuel, val: 30, color: 'bg-yellow-400' },
                { label: 'Rescue Eq', icon: LifeBuoy, val: 75, color: 'bg-cyan-400' },
              ].map((res, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5 text-gray-300"><res.icon size={12} className="text-gray-500" /> {res.label}</span>
                    <span className="font-mono text-gray-400">{res.val}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div className={clsx("h-full rounded-full shadow-[0_0_10px_currentColor]", res.color)} style={{ width: `${res.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* DSA Engine Widget */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border border-blue-500/20 bg-blue-950/20 backdrop-blur-md p-6 relative overflow-hidden group"
          >
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.4),transparent)]" />
            <h3 className="text-sm font-mono text-blue-400 uppercase tracking-widest flex items-center gap-2 mb-4 relative z-10">
              <Cpu size={16} /> Engine Telemetry
            </h3>
            
            {allocationLogs.length > 0 ? (
              <div className="space-y-3 relative z-10 text-xs font-mono">
                <div className="flex justify-between items-center p-2 rounded bg-black/40 border border-blue-500/10">
                  <span className="text-gray-500">Last Search</span>
                  <span className="text-blue-300">{allocationLogs[0].dsaStats.searchAlgorithm}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-black/40 border border-blue-500/10">
                  <span className="text-gray-500">Last Sort</span>
                  <span className="text-blue-300">{allocationLogs[0].dsaStats.sortAlgorithm}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-black/40 border border-blue-500/10">
                  <span className="text-gray-500">Complexity</span>
                  <span className="text-emerald-400">{allocationLogs[0].dsaStats.timeComplexity}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-black/40 border border-blue-500/10">
                  <span className="text-gray-500">Exec Time</span>
                  <span className="text-blue-300">{allocationLogs[0].dsaStats.executionTimeMs}ms</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-black/40 border border-blue-500/10">
                  <span className="text-gray-500">Comparisons</span>
                  <span className="text-blue-300">{allocationLogs[0].dsaStats.comparisons}</span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 text-xs font-mono border border-white/5 rounded bg-black/40 relative z-10">
                Awaiting Engine Trigger...
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-blue-500/20 flex items-center justify-between relative z-10">
              <span className="text-[10px] text-blue-500/70 uppercase">DSA Subsystem Active</span>
              <div className="flex gap-1">
                {[1,2,3].map(i => (
                  <div key={i} className={clsx("w-1 h-3 bg-blue-500/50 rounded-full", activeEmergencies > 0 ? "animate-pulse" : "")} style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon: Icon, color, delay }: { title: string, value: string, icon: any, color: string, delay: number }) {
  const colorMap: Record<string, { bg: string, text: string, border: string }> = {
    red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  };

  const theme = colorMap[color] || colorMap.blue;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="p-1 rounded-xl border border-white/5 bg-black/40 backdrop-blur-md relative overflow-hidden group hover:border-white/20 transition-all cursor-default"
    >
      <div className={clsx("absolute -inset-10 opacity-0 group-hover:opacity-20 transition-opacity blur-xl rounded-full", theme.bg)} />
      <div className="p-4 relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center border backdrop-blur-md", theme.bg, theme.border, theme.text)}>
            <Icon size={16} />
          </div>
        </div>
        <div>
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1 tracking-tighter">{value}</h3>
          <p className="text-[10px] lg:text-xs text-gray-500 font-mono uppercase tracking-wider">{title}</p>
        </div>
      </div>
    </motion.div>
  );
}
