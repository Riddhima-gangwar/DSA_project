import React from 'react';
import { motion } from 'framer-motion';
import { Search, Target, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function SearchAnalytics() {
  const mockAnalytics = [
    { id: 1, algo: 'Binary Search', target: '452', found: true, comparisons: 8, time: 0.12, date: new Date().toISOString() },
    { id: 2, algo: 'Linear Search', target: '12', found: false, comparisons: 500, time: 2.34, date: new Date(Date.now() - 3600000).toISOString() },
    { id: 3, algo: 'Binary Search', target: '99', found: true, comparisons: 5, time: 0.08, date: new Date(Date.now() - 7200000).toISOString() },
    { id: 4, algo: 'Linear Search', target: '452', found: true, comparisons: 320, time: 1.45, date: new Date(Date.now() - 86400000).toISOString() },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Search Analytics</h2>
        <p className="text-gray-400 text-sm">Historical performance of search operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center border-t-4 border-green-500">
          <CheckCircle size={32} className="text-green-400 mb-2" />
          <h3 className="text-2xl font-bold">75%</h3>
          <p className="text-sm text-gray-400">Success Rate</p>
        </div>
        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
          <Clock size={32} className="text-blue-400 mb-2" />
          <h3 className="text-2xl font-bold">0.99 ms</h3>
          <p className="text-sm text-gray-400">Avg Execution Time</p>
        </div>
        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
          <Target size={32} className="text-orange-400 mb-2" />
          <h3 className="text-2xl font-bold font-mono">452</h3>
          <p className="text-sm text-gray-400">Most Searched</p>
        </div>
        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
          <Search size={32} className="text-purple-400 mb-2" />
          <h3 className="text-2xl font-bold">124</h3>
          <p className="text-sm text-gray-400">Total Searches</p>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-sm font-semibold text-gray-300">
              <th className="p-4">Algorithm</th>
              <th className="p-4">Target</th>
              <th className="p-4">Status</th>
              <th className="p-4">Comparisons</th>
              <th className="p-4">Time (ms)</th>
              <th className="p-4">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {mockAnalytics.map((item, i) => (
              <motion.tr 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                key={item.id} className="border-b border-white/5 hover:bg-white/5"
              >
                <td className="p-4 font-semibold">{item.algo}</td>
                <td className="p-4 font-mono">{item.target}</td>
                <td className="p-4">
                  {item.found ? (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold">Found</span>
                  ) : (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-bold">Failed</span>
                  )}
                </td>
                <td className="p-4 font-mono">{item.comparisons}</td>
                <td className="p-4 font-mono text-emergency-accent-blue">{item.time}</td>
                <td className="p-4 text-sm text-gray-400">{new Date(item.date).toLocaleString()}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
