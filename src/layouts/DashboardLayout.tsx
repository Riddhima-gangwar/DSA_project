import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  SquaresFour, 
  Package, 
  Heartbeat,
  Warning,
  Buildings,
  Swap,
  ChartPieSlice,
  Flask,
  SignOut,
  List,
  X
} from '@phosphor-icons/react';
import { useAppContext } from '../context/AppContext';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout() {
  const { isEmergencyMode, setEmergencyMode } = useAppContext();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <SquaresFour size={20} weight="light" /> },
    { name: 'Inventory', path: '/dashboard/inventory', icon: <Package size={20} weight="light" /> },
    { name: 'Centers', path: '/dashboard/centers', icon: <Buildings size={20} weight="light" /> },
    { name: 'Requests', path: '/dashboard/requests', icon: <Warning size={20} weight="light" /> },
    { name: 'Allocation', path: '/dashboard/allocation', icon: <Swap size={20} weight="light" /> },
    { name: 'Reports', path: '/dashboard/reports', icon: <ChartPieSlice size={20} weight="light" /> },
    { name: 'DSA Lab', path: '/dashboard/dsa-lab', icon: <Flask size={20} weight="light" /> },
  ];

  return (
    <div className={clsx(
      "flex flex-col min-h-[100dvh] w-full transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
      isEmergencyMode ? "bg-[#0a0000]" : "bg-[#050505]"
    )}>
      
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none opacity-30 z-0">
        <div className="absolute top-0 left-1/4 w-[40vw] h-[40vw] rounded-full bg-emerald-600/10 blur-[120px]"></div>
        {isEmergencyMode && <div className="absolute bottom-0 right-1/4 w-[50vw] h-[50vw] rounded-full bg-red-600/20 blur-[150px] animate-pulse"></div>}
      </div>

      {/* Fluid Island Nav (Desktop) */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center glass-panel px-2 py-2 w-max gap-1">
        
        {/* Brand / Emergency Toggle */}
        <button 
          onClick={() => setEmergencyMode(!isEmergencyMode)}
          className={clsx(
            "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 mr-4 group relative",
            isEmergencyMode ? "bg-red-500/20 text-red-500" : "bg-white/5 text-gray-400 hover:text-white"
          )}
        >
          <Warning size={24} weight={isEmergencyMode ? "fill" : "light"} className={isEmergencyMode ? "animate-pulse" : ""} />
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {isEmergencyMode ? "DISABLE PROTOCOL" : "ENABLE PROTOCOL"}
          </span>
        </button>

        <div className="w-px h-8 bg-white/10 mr-4"></div>

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) => clsx(
              "flex items-center justify-center px-5 py-2.5 rounded-full transition-all duration-500 text-sm tracking-wide font-medium relative group",
              (isActive || (item.path === '/dashboard/dsa-lab' && location.pathname.includes('/dashboard/dsa-lab')))
                ? (isEmergencyMode ? "text-red-400" : "text-emerald-400")
                : "text-gray-400 hover:text-white"
            )}
          >
            {({ isActive }) => (
              <>
                {(isActive || (item.path === '/dashboard/dsa-lab' && location.pathname.includes('/dashboard/dsa-lab'))) && (
                  <motion.div 
                    layoutId="activeNavTab"
                    className={clsx(
                      "absolute inset-0 rounded-full -z-10",
                      isEmergencyMode ? "bg-red-500/10 border border-red-500/20" : "bg-emerald-500/10 border border-emerald-500/20"
                    )}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  />
                )}
                <span className="mr-2 opacity-50 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Mobile Hamburger Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 p-4 z-50 flex justify-between items-center backdrop-blur-md bg-black/50 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Warning size={24} weight="fill" className={isEmergencyMode ? "text-red-500 animate-pulse" : "text-emerald-500"} />
          <h1 className="text-lg font-bold">ReliefOps</h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-300 hover:text-white relative w-10 h-10 flex items-center justify-center"
        >
          <motion.div animate={{ rotate: isMobileMenuOpen ? 45 : 0 }} className="absolute">
            {!isMobileMenuOpen ? <List size={24} weight="light" /> : <div className="w-6 h-0.5 bg-white rounded"></div>}
          </motion.div>
          {isMobileMenuOpen && (
            <motion.div animate={{ rotate: -45 }} className="absolute">
              <div className="w-6 h-0.5 bg-white rounded"></div>
            </motion.div>
          )}
        </button>
      </div>

      {/* Mobile Overlay Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 backdrop-blur-3xl bg-black/90 flex flex-col pt-24 px-6"
          >
             {navItems.map((item, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 + 0.1, ease: [0.32,0.72,0,1], duration: 0.5 }}
                  key={item.path}
                >
                  <NavLink
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    end={item.path === '/dashboard'}
                    className={({ isActive }) => clsx(
                      "flex items-center py-4 text-2xl font-light tracking-wide border-b border-white/5",
                      isActive ? "text-emerald-400" : "text-gray-400"
                    )}
                  >
                    <span className="mr-4">{item.icon}</span>
                    {item.name}
                  </NavLink>
                </motion.div>
             ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-8 pt-24 md:pt-40 pb-24 z-10">
        <Outlet />
      </main>
    </div>
  );
}
