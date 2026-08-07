import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { FlaskConical, BarChart2, Activity, Settings, BookOpen } from 'lucide-react';
import clsx from 'clsx';

export default function DSALab() {
  const location = useLocation();
  const isBaseRoute = location.pathname === '/dashboard/dsa-lab' || location.pathname === '/dashboard/dsa-lab/';

  const navItems = [
    { name: 'Sorting Visualizer', path: 'sorting', icon: <BarChart2 size={16} /> },
    { name: 'Searching Visualizer', path: 'searching', icon: <Activity size={16} /> },
    { name: 'Algorithm Comparison', path: 'algorithms', icon: <Activity size={16} /> },
    { name: 'Performance Graphs', path: 'performance', icon: <BarChart2 size={16} /> },
    { name: 'Complexity Analytics', path: 'search-analytics', icon: <Settings size={16} /> },
    { name: 'Learning Material', path: 'learn', icon: <BookOpen size={16} /> },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 flex flex-col h-full min-h-[80vh]">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
          <FlaskConical className="mr-3 text-purple-500" size={32} /> DSA Learning Lab
        </h2>
        <p className="text-gray-400 text-base max-w-2xl">
          Educational sandbox for understanding the Data Structures and Algorithms powering the command center. 
          Visualize, compare, and learn about Sorting and Searching algorithms.
        </p>
      </div>

      {/* Sub-Navigation for DSA Lab */}
      <div className="glass-panel p-2 rounded-xl border border-white/10 bg-black/40 flex flex-wrap gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx(
              "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm font-semibold",
              isActive
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
            )}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative">
        {isBaseRoute ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black/20 rounded-xl border border-dashed border-white/10">
            <FlaskConical size={64} className="text-purple-500/30 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2">Welcome to the Algorithm Sandbox</h3>
            <p className="text-gray-400 max-w-md">
              Select an educational module from the menu above to visualize how our system sorts and searches through massive datasets in real-time.
            </p>
          </div>
        ) : (
          <div className="h-full">
            <Outlet />
          </div>
        )}
      </div>
    </div>
  );
}
