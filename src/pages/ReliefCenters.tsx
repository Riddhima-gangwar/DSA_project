import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Buildings, Users, Truck, Warning, CheckCircle, Database } from '@phosphor-icons/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export default function ReliefCenters() {
  const { centers, isEmergencyMode } = useAppContext();

  return (
    <div className="space-y-12 font-sans max-w-[1600px] mx-auto pb-24">
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold bg-white/5 border border-white/10 mb-6 text-gray-400">
          <Buildings size={12} weight="light" className="mr-2" /> Global Network
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tighter">Relief Centers</h2>
        <p className="text-gray-400 text-base max-w-2xl leading-relaxed">
          Monitor and manage all active relief centers. View capacity, deployed personnel, vehicle fleets, and available emergency resources across all regions.
        </p>
      </motion.div>

      {/* Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {centers.map((center, index) => {
          // Asymmetric logic: First item spans 2 columns on desktop
          const isFeatured = index === 0;

          return (
            <motion.div
              initial={{ opacity: 0, y: 30, filter: 'blur(5px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
              key={center.id}
              className={clsx(
                "glass-panel p-1.5 flex flex-col group",
                isFeatured ? "md:col-span-2 lg:col-span-2" : "col-span-1"
              )}
            >
              <div className={clsx(
                "glass-inner rounded-[calc(2rem-0.375rem)] flex flex-col h-full overflow-hidden relative",
                center.status === 'Active' ? 'bg-black/50' :
                center.status === 'Overwhelmed' ? 'bg-orange-950/20 shadow-[inset_0_0_50px_rgba(249,115,22,0.05)]' :
                'bg-red-950/20 shadow-[inset_0_0_50px_rgba(239,68,68,0.05)]'
              )}>
                
                {/* Background Glow */}
                <div className={clsx(
                  "absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-20 pointer-events-none transition-opacity group-hover:opacity-40",
                  center.status === 'Active' ? 'bg-emerald-500' :
                  center.status === 'Overwhelmed' ? 'bg-orange-500' :
                  'bg-red-500'
                )} />

                {/* Header */}
                <div className="p-8 border-b border-white/5 flex justify-between items-start z-10">
                  <div>
                    <h3 className={clsx(
                      "font-bold text-white tracking-tight",
                      isFeatured ? "text-3xl" : "text-xl"
                    )}>{center.name}</h3>
                    <p className="text-gray-500 text-xs mt-2 font-mono">{center.id} <span className="mx-2">•</span> {center.region}</p>
                  </div>
                  <div className={clsx(
                    "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                    center.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    center.status === 'Overwhelmed' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                    'bg-red-500/10 text-red-400 border-red-500/20'
                  )}>
                    {center.status}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col gap-6 z-10">
                  
                  {isEmergencyMode && center.nearestDisasterRegion && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center space-x-3 text-red-400 text-sm">
                      <Warning size={20} weight="fill" className="animate-pulse shrink-0" />
                      <span>Serving Active Zone: <strong className="font-bold tracking-wide">{center.nearestDisasterRegion}</strong></span>
                    </div>
                  )}

                  <div className={clsx(
                    "grid gap-4",
                    isFeatured ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2"
                  )}>
                    <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5 hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-center text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-2">
                        <Database size={14} weight="light" className="mr-2" /> Capacity
                      </div>
                      <div className="text-xl text-white font-mono">{center.capacity.toLocaleString()}</div>
                    </div>
                    <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors">
                      <div className="flex items-center text-emerald-500/70 text-[10px] uppercase font-bold tracking-widest mb-2">
                        <Buildings size={14} weight="light" className="mr-2" /> Resources
                      </div>
                      <div className="text-xl text-emerald-400 font-mono font-bold">{center.resourcesAvailable?.toLocaleString() || '0'}</div>
                    </div>
                    <div className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/10 hover:bg-blue-500/10 transition-colors">
                      <div className="flex items-center text-blue-500/70 text-[10px] uppercase font-bold tracking-widest mb-2">
                        <Users size={14} weight="light" className="mr-2" /> Personnel
                      </div>
                      <div className="text-xl text-blue-400 font-mono font-bold">{center.personnel || '0'}</div>
                    </div>
                    <div className="bg-orange-500/5 rounded-xl p-4 border border-orange-500/10 hover:bg-orange-500/10 transition-colors">
                      <div className="flex items-center text-orange-500/70 text-[10px] uppercase font-bold tracking-widest mb-2">
                        <Truck size={14} weight="light" className="mr-2" /> Vehicles
                      </div>
                      <div className="text-xl text-orange-400 font-mono font-bold">{center.vehicles || '0'}</div>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4 text-xs font-mono">
                    <p className="text-gray-500">MANAGER: <span className="text-gray-300 ml-2">{center.manager}</span></p>
                    <p className="text-gray-500">CONTACT: <span className="text-gray-300 ml-2">{center.contact}</span></p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
