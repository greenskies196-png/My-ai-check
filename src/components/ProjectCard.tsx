import React from 'react';
import { motion } from 'motion/react';
import { Star, GitBranch, Calendar, ChevronRight } from 'lucide-react';
import type { Project } from '../pages/Dashboard';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  project: Project;
  index: number;
  onClick: () => void;
  key?: string | number;
}

export default function ProjectCard({ project, index, onClick }: Props) {
  const { isLight } = useTheme();
  
  const formattedStars = new Intl.NumberFormat('en-US', { 
    notation: "compact", 
    compactDisplay: "short" 
  }).format(project.stars);

  const formattedDate = new Date(project.lastUpdated).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -30, rotateX: 10 }}
      animate={{ opacity: 1, x: 0, rotateX: 0 }}
      transition={{ duration: 0.6, delay: 0.3 + (index * 0.1), ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative flex flex-col sm:flex-row backdrop-blur-xl border rounded-xl p-5 cursor-pointer transition-all duration-300 overflow-hidden ${
        isLight 
          ? 'bg-white/80 border-slate-200 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/10' 
          : 'bg-slate-900/60 border-slate-800 hover:border-cyan-400'
      }`}
    >
      {/* Sci-Fi Rotating Border Glow (Hover only) */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className={`absolute -inset-[100%] ${
            isLight ? 'bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(99,102,241,0.2)_360deg)]' : 'bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(34,211,238,0.5)_360deg)]'
          }`}
        />
        {/* Inner mask to keep glow only on the edges */}
        <div className={`absolute inset-[1px] rounded-xl pointer-events-none ${isLight ? 'bg-white/95' : 'bg-slate-900'}`}></div>
      </div>

      {/* Futuristic Corner Accents */}
      <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-transparent transition-colors duration-300 rounded-tl-xl z-20 pointer-events-none ${
        isLight ? 'group-hover:border-indigo-500' : 'group-hover:border-cyan-400'
      }`}></div>
      <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-transparent transition-colors duration-300 rounded-br-xl z-20 pointer-events-none ${
        isLight ? 'group-hover:border-blue-500' : 'group-hover:border-indigo-400'
      }`}></div>
      
      {/* Laser Scanning Line */}
      <motion.div 
        className={`absolute top-0 bottom-0 left-0 w-[1px] bg-transparent z-20 pointer-events-none ${
          isLight ? 'group-hover:bg-indigo-400/50 shadow-[0_0_8px_2px_rgba(99,102,241,0.5)]' : 'group-hover:bg-cyan-400/50 shadow-[0_0_8px_2px_rgba(34,211,238,0.5)]'
        }`}
        initial={{ x: "-100%" }}
        whileHover={{ x: "600px" }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Content wrapper */}
      <div className="flex-grow min-w-0 pr-4 relative z-30">
        <div className="flex items-baseline space-x-2 mb-1.5">
          <span className={`text-[10px] sm:text-xs font-medium uppercase tracking-widest transition-colors ${
            isLight ? 'text-indigo-600/70' : 'text-cyan-500/70'
          }`}>{project.owner} /</span>
          <h3 className={`text-lg font-bold truncate transition-colors ${
            isLight ? 'text-slate-900 group-hover:text-indigo-950' : 'text-slate-100 group-hover:text-cyan-50'
          }`}>{project.name}</h3>
        </div>
        
        <p className={`text-sm line-clamp-2 mb-4 leading-relaxed transition-colors ${
          isLight ? 'text-slate-600 group-hover:text-slate-800' : 'text-slate-400/80 group-hover:text-slate-300'
        }`}>
          {project.description || 'No description provided.'}
        </p>
        
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
          <div className="flex items-center space-x-1.5">
            <Star className={`w-4 h-4 transition-colors ${isLight ? 'text-amber-500 group-hover:text-amber-600' : 'text-cyan-400/80 group-hover:text-cyan-300'}`} />
            <span className={`transition-colors ${isLight ? 'text-slate-700 group-hover:text-slate-900' : 'text-slate-300 group-hover:text-white'}`}>{formattedStars}</span>
          </div>
          
          {project.language && (
            <div className="flex items-center space-x-1.5">
              <div className={`w-2.5 h-2.5 rounded-sm rotate-45 transition-colors ${isLight ? 'bg-indigo-500/80 group-hover:bg-indigo-600' : 'bg-indigo-500/80 group-hover:bg-indigo-400'}`}></div>
              <span className={`transition-colors ${isLight ? 'group-hover:text-slate-700' : 'group-hover:text-slate-300'}`}>{project.language}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-1.5 opacity-70 group-hover:opacity-100 transition-opacity hidden sm:flex">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-end mt-4 sm:mt-0 opacity-40 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 relative z-30">
        <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 ${
          isLight 
            ? 'bg-slate-50/80 border-slate-200 group-hover:border-indigo-300 group-hover:bg-indigo-50 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]'
            : 'bg-slate-800/80 border-slate-700/50 group-hover:border-cyan-500/40 group-hover:bg-cyan-500/10 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]'
        }`}>
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <ChevronRight className={`w-5 h-5 ${isLight ? 'text-indigo-600' : 'text-cyan-400'}`} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
