import React from 'react';
import { 
  FileText, DownloadSimple, TrendUp, Warning, 
  Package, Buildings, ChartBar, Database, ArrowRight
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const reportsList = [
  { 
    title: 'Daily Resource Report', 
    desc: 'Comprehensive summary of all inventory changes, incoming shipments, and distributions across all relief centers over the last 24 hours.',
    icon: <Database weight="light" />,
    color: 'emerald',
    featured: true
  },
  { 
    title: 'Critical Resource Report', 
    desc: 'Detailed breakdown of high-priority items deployed in active disaster zones.',
    icon: <Warning weight="light" />,
    color: 'red',
    featured: false
  },
  { 
    title: 'Low Stock Report', 
    desc: 'Actionable list of all resources falling below the minimum threshold required for emergency preparedness.',
    icon: <Package weight="light" />,
    color: 'orange',
    featured: false
  },
  { 
    title: 'Relief Center Report', 
    desc: 'Capacity metrics, personnel deployment status, and structural integrity assessments.',
    icon: <Buildings weight="light" />,
    color: 'blue',
    featured: false
  },
  { 
    title: 'Emergency Summary', 
    desc: 'High-level overview of current disasters, affected population estimates, and overall response phases.',
    icon: <TrendUp weight="light" />,
    color: 'purple',
    featured: false
  },
  { 
    title: 'Allocation Report', 
    desc: 'Logs of algorithmically routed resources, including time complexities and efficiency metrics of the DSA engine.',
    icon: <ChartBar weight="light" />,
    color: 'indigo',
    featured: false
  }
];

export default function Reports() {
  const getColorClasses = (color: string) => {
    switch(color) {
      case 'emerald': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
      case 'red': return 'bg-red-500/10 border-red-500/20 text-red-400 group-hover:bg-red-500/20 group-hover:border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.1)]';
      case 'orange': return 'bg-orange-500/10 border-orange-500/20 text-orange-400 group-hover:bg-orange-500/20 group-hover:border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.1)]';
      case 'blue': return 'bg-blue-500/10 border-blue-500/20 text-blue-400 group-hover:bg-blue-500/20 group-hover:border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.1)]';
      case 'purple': return 'bg-purple-500/10 border-purple-500/20 text-purple-400 group-hover:bg-purple-500/20 group-hover:border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.1)]';
      case 'indigo': return 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.1)]';
      default: return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-12 font-sans max-w-[1600px] mx-auto pb-24">
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8"
      >
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold bg-white/5 border border-white/10 mb-6 text-gray-400">
            <ChartBar size={12} weight="light" className="mr-2" /> Data Intelligence
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tighter">Reports & Analytics</h2>
          <p className="text-gray-400 text-base max-w-2xl leading-relaxed">
            Generate and export official documentation for disaster management operations. All reports compile real-time data from the central DSA engine.
          </p>
        </div>
        
        <button className="group flex items-center justify-center px-6 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium text-white shadow-xl active:scale-[0.98]">
          <DownloadSimple size={20} weight="light" className="mr-3 opacity-70 group-hover:opacity-100 group-hover:-translate-y-0.5 transition-all" />
          Export All Data (.CSV)
        </button>
      </motion.div>

      {/* Asymmetric Bento Grid for Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reportsList.map((report, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 30, filter: 'blur(5px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            key={idx} 
            className={clsx(
              "group glass-panel p-2 flex flex-col cursor-pointer transition-all duration-500 hover:shadow-2xl",
              report.featured ? "md:col-span-2 lg:col-span-2" : "col-span-1"
            )}
          >
            <div className="glass-inner rounded-[calc(2rem-0.5rem)] p-8 md:p-10 flex flex-col h-full relative overflow-hidden bg-black/40 hover:bg-black/20 transition-colors">
              
              <div className={`absolute -right-12 -top-12 w-48 h-48 rounded-full blur-[80px] opacity-10 transition-opacity duration-700 group-hover:opacity-30 pointer-events-none ${
                report.color === 'emerald' ? 'bg-emerald-500' :
                report.color === 'red' ? 'bg-red-500' :
                report.color === 'orange' ? 'bg-orange-500' :
                report.color === 'blue' ? 'bg-blue-500' :
                report.color === 'purple' ? 'bg-purple-500' :
                'bg-indigo-500'
              }`}></div>
              
              <div className="flex justify-between items-start mb-12 z-10">
                <div className={clsx("p-4 rounded-2xl border transition-all duration-500", getColorClasses(report.color))}>
                  {React.cloneElement(report.icon, { size: 28 })}
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 text-gray-500 group-hover:bg-white/10 group-hover:text-white transition-all duration-500">
                  <FileText size={20} weight="light" />
                </div>
              </div>
              
              <div className="z-10 flex-1 flex flex-col">
                <h3 className={clsx(
                  "font-bold text-white mb-4 tracking-tight group-hover:text-emerald-400 transition-colors",
                  report.featured ? "text-3xl" : "text-2xl"
                )}>
                  {report.title}
                </h3>
                <p className="text-gray-400 leading-relaxed mb-10 flex-1">
                  {report.desc}
                </p>
                
                <div className="mt-auto flex items-center">
                  <div className="text-sm font-bold text-white flex items-center space-x-2">
                    <span className="opacity-70 group-hover:opacity-100 transition-opacity uppercase tracking-widest text-[10px]">Generate Report</span>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-all duration-500 group-hover:translate-x-2">
                      <ArrowRight size={14} weight="bold" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
