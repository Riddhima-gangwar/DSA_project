import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useNavigate } from 'react-router-dom';
import Hero3DScene from '../components/landing/Hero3DScene';
import { ArrowRight, BookOpen, GithubLogo } from '@phosphor-icons/react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden relative flex flex-col">
      
      {/* Background styling - Ethereal Glass */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-900/10 via-[#050505] to-[#050505]"></div>
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-blue-600/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 flex-1 flex flex-col lg:flex-row items-center justify-between relative z-10 py-12 lg:py-0">
        
        {/* Left Content Area - The Editorial Split */}
        <motion.div 
          initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
          className="w-full lg:w-[55%] flex flex-col justify-center z-20 pointer-events-auto py-12 lg:min-h-screen"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 w-max">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-3"></span>
            ReliefOps Operations Center
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-[4.5rem] font-bold text-white leading-[1.1] mb-8 tracking-tighter">
            Disaster Relief <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
              Resource Management
            </span> <br/>
            System
          </h1>
          
          <h2 className="text-base md:text-lg lg:text-xl text-gray-400 font-medium mb-10 max-w-2xl leading-relaxed">
            A high-performance command platform for managing relief resources during natural disasters, powered by efficient Sorting and Searching Algorithms.
          </h2>
          
          {/* Double-Bezel Card */}
          <div className="glass-panel p-1.5 mb-10 max-w-2xl">
            <div className="glass-inner rounded-[calc(2rem-0.375rem)] p-6 md:p-8">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Problem Statement</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Natural disasters create thousands of emergency requests. Authorities must quickly locate available resources, prioritize urgent requests, and allocate supplies efficiently. This platform simulates a Disaster Command Center that uses Data Structures and Algorithms to drastically improve response time.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <button 
              onClick={() => navigate('/dashboard')}
              className="group flex items-center justify-between px-6 sm:px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-sm transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] active:scale-[0.98]"
            >
              Launch Command Center
              <div className="ml-4 sm:ml-6 w-8 h-8 rounded-full bg-black/20 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-[1px] transition-transform">
                <ArrowRight size={16} weight="bold" />
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/dashboard/dsa-lab')}
              className="group flex items-center justify-between px-6 sm:px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-bold text-sm transition-all active:scale-[0.98]"
            >
              System Architecture
              <div className="ml-4 sm:ml-6 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <BookOpen size={16} weight="light" />
              </div>
            </button>
            
            <a 
              href="https://github.com/Riddhima-gangwar/DSA_project" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center justify-between px-6 sm:px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-bold text-sm transition-all active:scale-[0.98]"
            >
              GitHub Source
              <div className="ml-4 sm:ml-6 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <GithubLogo size={16} weight="fill" />
              </div>
            </a>
          </div>
        </motion.div>

        {/* Right 3D Scene Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, ease: [0.32, 0.72, 0, 1], delay: 0.3 }}
          className="w-full lg:w-[45%] h-[400px] lg:h-screen lg:absolute lg:right-0 lg:top-0 pointer-events-none relative"
        >
          <div className="absolute inset-0 pointer-events-auto">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
              <ambientLight intensity={0.2} />
              <directionalLight position={[10, 10, 5]} intensity={1} color="#10b981" />
              <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />
              <Suspense fallback={null}>
                <Hero3DScene />
                <EffectComposer>
                  <Bloom luminanceThreshold={0.2} mipmapBlur intensity={2.0} />
                </EffectComposer>
              </Suspense>
              <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
            </Canvas>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
}
