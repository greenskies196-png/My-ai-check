import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { X, ExternalLink, Github } from 'lucide-react';
import type { Project } from '../pages/Dashboard';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  project: Project;
  onClose: () => void;
}

export default function SummaryModal({ project, onClose }: Props) {
  const { isLight } = useTheme();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6 md:py-12">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={`absolute inset-0 backdrop-blur-sm ${isLight ? 'bg-slate-800/40' : 'bg-slate-950/80'}`}
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`relative w-full max-w-2xl max-h-full overflow-hidden flex flex-col backdrop-blur-2xl border rounded-2xl ${
          isLight 
            ? 'bg-white/95 border-indigo-200 shadow-[0_0_50px_rgba(99,102,241,0.15)]' 
            : 'bg-slate-900/90 border-cyan-500/20 shadow-[0_0_50px_rgba(34,211,238,0.15)]'
        }`}
      >
        {/* Animated Cyber Grid lines inside modal */}
        <div className={`absolute inset-0 pointer-events-none opacity-30 bg-[size:2rem_2rem] ${
          isLight 
            ? 'bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)]'
            : 'bg-[linear-gradient(to_right,#34d39910_1px,transparent_1px),linear-gradient(to_bottom,#34d39910_1px,transparent_1px)]'
        }`}></div>
        
        {/* Animated Scanning Beam on load */}
        <motion.div 
          animate={{ y: ["-100%", "500%"] }}
          transition={{ duration: 3, ease: "linear", repeat: Infinity, repeatDelay: 5 }}
          className={`absolute left-0 right-0 h-16 pointer-events-none z-0 bg-gradient-to-b ${
            isLight ? 'from-transparent via-indigo-500/5 to-transparent' : 'from-transparent via-cyan-400/10 to-transparent'
          }`}
        />

        {/* Header decoration */}
        <div className="absolute top-0 inset-x-0 h-1 relative overflow-hidden">
           <motion.div 
              animate={{ x: ["-100%", "200%"] }} 
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute inset-y-0 w-1/3 bg-gradient-to-r ${
                isLight ? 'from-transparent via-indigo-500 to-transparent' : 'from-transparent via-cyan-400 to-transparent'
              }`}
           />
           <div className={`absolute inset-0 bg-gradient-to-r opacity-50 ${
             isLight ? 'from-indigo-400 via-blue-500 to-indigo-400' : 'from-cyan-600 via-indigo-600 to-cyan-600'
           }`}></div>
        </div>
        
        <div className={`flex items-center justify-between p-6 md:p-8 border-b relative z-10 ${
          isLight ? 'border-slate-200 bg-white/60' : 'border-cyan-900/30 bg-slate-950/40'
        }`}>
          <div className={`flex items-center space-x-3 ${isLight ? 'text-indigo-600' : 'text-cyan-500/70'}`}>
            <Github className="w-6 h-6" />
            <h3 className={`text-xl md:text-2xl font-semibold pr-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] ${
              isLight ? 'text-slate-900' : 'text-slate-100'
            }`}>
              {project.owner} / <span className={`${isLight ? 'text-indigo-900' : 'text-white'}`}>{project.name}</span>
            </h3>
          </div>
          
          <button 
            onClick={onClose}
            className={`p-2 -mr-2 rounded-full transition-colors border border-transparent ${
              isLight 
                ? 'hover:bg-red-50 hover:text-red-500 text-slate-400 hover:border-red-200' 
                : 'hover:bg-red-500/10 hover:text-red-400 text-slate-400 hover:border-red-500/30'
            }`}
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className={`overflow-y-auto p-6 md:p-8 flex-grow relative z-10 ${isLight ? 'selection:bg-indigo-500/30' : 'selection:bg-cyan-500/30'}`}>
          <div className="mb-8 relative">
            <h4 className={`text-xs font-bold tracking-[0.2em] uppercase mb-5 flex items-center ${
              isLight ? 'text-indigo-600' : 'text-cyan-400'
            }`}>
              <span className={`w-2 h-2 rounded-sm mr-3 animate-pulse ${
                isLight ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]'
              }`}></span>
              <span className={`w-8 h-[1px] mr-3 ${isLight ? 'bg-indigo-500/30' : 'bg-cyan-500/50'}`}></span>
              AI Insight Summary
            </h4>
            
            <div className={`prose prose-lg max-w-none leading-relaxed font-light ${
              isLight ? 'prose-slate text-slate-700' : 'prose-invert prose-slate text-slate-300'
            }`}>
              {project.summary ? (
                <p className="whitespace-pre-wrap">{project.summary}</p>
              ) : (
                <p className={`italic ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Summary unavailable.</p>
              )}
            </div>
          </div>
        </div>
        
        <div className={`p-6 md:p-8 border-t flex justify-between items-center relative z-10 ${
          isLight ? 'border-indigo-100 bg-slate-50/80' : 'border-cyan-900/30 bg-slate-950/80'
        }`}>
          <div className="text-xs font-mono uppercase tracking-widest text-slate-500">
            Analyzed by Gemini 2.5 Flash
          </div>
          
          <a 
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full border font-medium transition-all focus:ring-4 overflow-hidden group ${
              isLight
                ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700 hover:border-indigo-300 focus:ring-indigo-500/20 shadow-[0_4px_10px_rgba(99,102,241,0.05)] hover:shadow-[0_4px_15px_rgba(99,102,241,0.15)]'
                : 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 hover:border-cyan-400 text-cyan-300 focus:ring-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_25px_rgba(34,211,238,0.2)]'
            }`}
          >
            <span className="relative z-10 uppercase tracking-wider text-sm">View Node</span>
            <ExternalLink className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
