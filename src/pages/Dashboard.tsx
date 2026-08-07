import React from 'react';
import { 
  Warning, Heartbeat, Package, Truck, 
  MapPin, ShieldWarning, Lightning, Clock, Fire
} from '@phosphor-icons/react';
import { useAppContext } from '../context/AppContext';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { isEmergencyMode, resources } = useAppContext();

  const criticalResources = resources.filter(r => r.priority === 'Critical').length;
  const totalAvailable = resources.filter(r => r.status === 'Available').reduce((acc, r) => acc + r.quantity, 0);
  
  return (
    <div className="space-y-12">
      
      {/* Top Status Banner (Ethereal Glass Hero) */}
      <motion.div 
        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        className={clsx(
          "w-full rounded-[2.5rem] p-2 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-700 glass-panel relative overflow-hidden",
          isEmergencyMode ? "shadow-[0_20px_40px_-15px_rgba(239,68,68,0.2)]" : "shadow-[0_20px_40px_-15px_rgba(16,185,129,0.1)]"
        )}
      >
        <div className="absolute inset-0 z-0">
           <div className={clsx(
             "absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl rounded-full opacity-20 blur-[100px]",
             isEmergencyMode ? "from-red-600 to-transparent" : "from-emerald-600 to-transparent"
           )} />
        </div>

        <div className="glass-inner w-full rounded-[calc(2.5rem-0.5rem)] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between z-10 relative">
          <div className="flex items-center space-x-8">
            <div className={clsx(
              "w-20 h-20 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-xl",
              isEmergencyMode ? "bg-red-500/10 text-red-500 shadow-[inset_0_0_20px_rgba(239,68,68,0.2)]" : "bg-emerald-500/10 text-emerald-400 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]"
            )}>
              <Warning size={40} weight={isEmergencyMode ? "fill" : "light"} className={isEmergencyMode ? "animate-pulse" : ""} />
            </div>
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium bg-white/5 border border-white/10 mb-3 text-gray-400">
                <span className={clsx("w-1.5 h-1.5 rounded-full mr-2", isEmergencyMode ? "bg-red-500 animate-pulse" : "bg-emerald-500")}></span>
                {isEmergencyMode ? 'Critical Alert' : 'System Normal'}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-none mb-2">
                {isEmergencyMode ? 'CATEGORY 4 CYCLONE' : 'SYSTEM STANDBY'}
              </h2>
              <p className="text-gray-400 text-sm mt-2 uppercase tracking-widest font-mono">
                Primary Region: East Coast
              </p>
            </div>
          </div>
          
          <div className="flex gap-12 mt-8 md:mt-0">
            <div className="text-center">
              <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-2">Time Elapsed</p>
              <p className="text-3xl font-mono text-white tracking-tight">48:12:05</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-2">Status</p>
              <p className={clsx(
                "text-3xl tracking-tight font-medium",
                isEmergencyMode ? "text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]"
              )}>
                {isEmergencyMode ? 'CRITICAL' : 'MONITORING'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Grid (Double Bezel Asymmetric layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Critical Requests" 
          value="124" 
          icon={<ShieldWarning size={28} weight="light" />} 
          trend="+12% since last hour" 
          color="red"
          delay={0.1}
        />
        <KPICard 
          title="Resources Available" 
          value={totalAvailable.toLocaleString()} 
          icon={<Package size={28} weight="light" />} 
          trend="Adequate supply" 
          color="emerald" 
          delay={0.2}
        />
        <KPICard 
          title="Resources Dispatched" 
          value="45,200" 
          icon={<Truck size={28} weight="light" />} 
          trend="8 convoys en route" 
          color="blue" 
          delay={0.3}
        />
        <KPICard 
          title="Active Relief Centers" 
          value="18" 
          icon={<MapPin size={28} weight="light" />} 
          trend="3 operating at max capacity" 
          color="orange" 
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24">
        
        {/* Main Feed (Span 8) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.2 }}
          className="lg:col-span-8 glass-panel p-2 flex flex-col"
        >
          <div className="glass-inner rounded-[calc(2rem-0.5rem)] p-8 flex-1">
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
              <h3 className="text-2xl font-bold text-white flex items-center tracking-tight">
                <Heartbeat className="mr-3 text-emerald-400" size={24} weight="light" />
                Live Dispatch Feed
              </h3>
              <span className="flex items-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-mono font-bold tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-2"></span>
                System Live
              </span>
            </div>
            
            <div className="space-y-6 max-h-[500px] overflow-y-auto hide-scrollbar relative">
              {[
                { time: '14:32:10', type: 'DISPATCH', desc: '500 Medical Kits routed to East Coast Center.', priority: 'High' },
                { time: '14:28:45', type: 'ALERT', desc: 'Water supply critically low at Mountain Region.', priority: 'Critical' },
                { time: '14:15:00', type: 'UPDATE', desc: 'Convoy #4 arrived at South District.', priority: 'Normal' },
                { time: '14:05:22', type: 'REQUEST', desc: 'New request for Rescue Equipment from Coastal Area.', priority: 'High' },
                { time: '13:45:10', type: 'DISPATCH', desc: '1000 Thermal Blankets routed to Highland Shelter.', priority: 'Medium' },
                { time: '13:30:00', type: 'ALERT', desc: 'Power grid failure reported in North District.', priority: 'Critical' },
              ].map((log, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  transition={{ delay: i * 0.1 + 0.3, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                  key={i} 
                  className="flex items-start space-x-6 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.02] hover:bg-white/[0.04] transition-all group cursor-default"
                >
                  <div className="text-xs font-mono text-gray-600 pt-1 w-20 shrink-0">{log.time}</div>
                  <div className="flex-1">
                    <div className="flex flex-col space-y-2">
                      <span className={clsx(
                        "text-[9px] uppercase tracking-[0.2em] font-bold w-max",
                        log.type === 'ALERT' ? 'text-red-400' :
                        log.type === 'DISPATCH' ? 'text-blue-400' :
                        log.type === 'UPDATE' ? 'text-emerald-400' :
                        'text-orange-400'
                      )}>
                        {log.type}
                      </span>
                      <span className="text-base font-medium text-gray-300 leading-relaxed group-hover:text-white transition-colors">{log.desc}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Right Sidebar Widgets (Span 4) */}
        <div className="lg:col-span-4 space-y-8 flex flex-col">
          
          {/* Low Stock Alerts */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.4 }}
            className="glass-panel p-2 flex-1"
          >
            <div className="glass-inner rounded-[calc(2rem-0.5rem)] p-8 h-full">
              <h3 className="text-xl font-bold text-white flex items-center tracking-tight mb-8">
                <Fire className="mr-3 text-orange-500" size={24} weight="fill" />
                Low Stock
              </h3>
              <div className="space-y-4">
                {[
                  { item: 'Purified Water', center: 'Mountain Region', qty: '120 units', p: 8 },
                  { item: 'Antibiotics', center: 'City Center', qty: '45 units', p: 4 },
                  { item: 'Rescue Boats', center: 'East Coast', qty: '2 units', p: 9 },
                ].map((stock, i) => (
                  <div key={i} className="group flex justify-between items-center p-4 rounded-xl bg-black/50 border border-white/5 hover:border-orange-500/30 transition-all cursor-pointer">
                    <div>
                      <p className="text-sm font-medium text-gray-200 group-hover:text-white">{stock.item}</p>
                      <p className="text-xs text-gray-500 mt-1">{stock.center}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={clsx("text-sm font-mono font-bold", stock.p > 5 ? "text-red-400" : "text-orange-400")}>{stock.qty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Response Phase */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.5 }}
            className="glass-panel p-2 flex-1"
          >
            <div className="glass-inner rounded-[calc(2rem-0.5rem)] p-8 h-full">
              <h3 className="text-xl font-bold text-white flex items-center tracking-tight mb-8">
                <Lightning className="mr-3 text-emerald-400" size={24} weight="light" />
                Response Phase
              </h3>
              
              <div className="relative pl-6 border-l border-white/10 space-y-8 mt-4">
                <div className="relative">
                  <div className="absolute w-3 h-3 bg-emerald-500/50 border border-emerald-500 rounded-full -left-[30px] top-1"></div>
                  <p className="text-sm font-medium text-gray-300">Phase 1: Preparedness</p>
                  <p className="text-xs text-gray-600 font-mono mt-1">48h ago</p>
                </div>
                <div className="relative">
                  <div className="absolute w-3 h-3 bg-emerald-500/50 border border-emerald-500 rounded-full -left-[30px] top-1"></div>
                  <p className="text-sm font-medium text-gray-300">Phase 2: Response</p>
                  <p className="text-xs text-gray-600 font-mono mt-1">24h ago</p>
                </div>
                <div className="relative">
                  <div className="absolute w-4 h-4 bg-red-500/20 border border-red-500 rounded-full -left-[32px] top-0.5 shadow-[0_0_15px_#ef4444] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                  </div>
                  <p className="text-sm font-bold text-red-400">Phase 3: Active Relief</p>
                  <p className="text-xs text-gray-500 font-mono mt-1">Current</p>
                </div>
                <div className="relative opacity-30">
                  <div className="absolute w-3 h-3 border border-gray-600 rounded-full -left-[30px] top-1"></div>
                  <p className="text-sm font-medium text-gray-400">Phase 4: Recovery</p>
                  <p className="text-xs text-gray-600 font-mono mt-1">Pending</p>
                </div>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon, trend, color, delay }: { title: string, value: string, icon: React.ReactNode, trend: string, color: string, delay: number }) {
  const colorMap: Record<string, string> = {
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30, filter: 'blur(5px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay }}
      className="glass-panel p-1.5"
    >
      <div className="glass-inner rounded-[calc(2rem-0.375rem)] p-6 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start mb-6">
          <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center border backdrop-blur-md", colorMap[color])}>
            {icon}
          </div>
        </div>
        <div>
          <h3 className="text-4xl font-bold text-white mb-2 tracking-tighter">{value}</h3>
          <p className="text-sm text-gray-400 font-medium">{title}</p>
          <p className="text-xs text-gray-600 mt-3 border-t border-white/5 pt-3 font-mono">{trend}</p>
        </div>
      </div>
    </motion.div>
  );
}
