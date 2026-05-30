import React from 'react';
import { motion } from 'motion/react';
import type { Category, Project } from '../pages/Dashboard';
import ProjectCard from './ProjectCard';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  category: Category;
  index: number;
  onSelectProject: (p: Project) => void;
  key?: string | number;
}

export default function CategoryPanel({ category, index, onSelectProject }: Props) {
  const { isLight } = useTheme();

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.7, 
        delay: index * 0.15,
        ease: [0.21, 0.47, 0.32, 0.98] 
      }}
      className="flex flex-col h-full relative"
    >
      <div className="flex items-center mb-6 space-x-4 relative z-10">
        <motion.div 
          animate={{ rotate: 90 }} 
          transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
          className={`w-2 h-2 ${isLight ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]'}`} 
        />
        <h2 className={`text-xl md:text-2xl font-bold tracking-tight whitespace-nowrap uppercase transition-colors ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
          {category.name}
        </h2>
        <div className={`h-[1px] flex-grow relative ${isLight ? 'bg-gradient-to-r from-indigo-500/50 via-blue-500/20 to-transparent' : 'bg-gradient-to-r from-cyan-500/50 via-indigo-500/20 to-transparent'}`}>
           <motion.div 
             animate={{ x: ["0%", "100%", "0%"] }} 
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className={`absolute top-0 bottom-0 left-0 w-8 blur-[2px] ${isLight ? 'bg-indigo-400/80' : 'bg-cyan-400/80'}`} 
           />
        </div>
      </div>
      
      <div className="space-y-5 flex-grow z-10 relative">
        {category.projects.map((project, idx) => (
          <ProjectCard 
            key={project.name} 
            project={project} 
            index={idx}
            onClick={() => onSelectProject(project)}
          />
        ))}
        {category.projects.length === 0 && (
          <div className={`p-8 text-center border border-dashed rounded-xl uppercase tracking-widest text-sm backdrop-blur-sm transition-colors ${
            isLight ? 'border-indigo-200 bg-white/50 text-slate-500' : 'border-cyan-700/30 bg-slate-900/30 text-slate-500'
          }`}>
            No projects discovered for this category today.
          </div>
        )}
      </div>
    </motion.section>
  );
}
