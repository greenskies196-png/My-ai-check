import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, AlertCircle, Sun, Moon } from 'lucide-react';
import CategoryPanel from '../components/CategoryPanel';
import SummaryModal from '../components/SummaryModal';
import { useTheme } from '../contexts/ThemeContext';

export interface Project {
  name: string;
  owner: string;
  url: string;
  description: string;
  stars: number;
  language: string;
  lastUpdated: string;
  summary: string;
}

export interface Category {
  name: string;
  projects: Project[];
}

export default function Dashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { isLight, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch categories');
        }
        
        setCategories(data.categories);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  return (
    <div className={`min-h-screen font-sans relative overflow-hidden transition-colors duration-500 ${isLight ? 'bg-slate-50 text-slate-900 selection:bg-indigo-500/30' : 'bg-slate-950 text-slate-100 selection:bg-cyan-500/30'}`}>
      
      {/* Theme Toggle Button */}
      <div className="absolute top-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className={`flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-md border transition-all duration-300 ${
            isLight 
              ? 'bg-white/80 border-indigo-200 text-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:bg-white' 
              : 'bg-slate-900/80 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:bg-slate-800'
          }`}
        >
          {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Animated Sci-Fi Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${
          isLight ? 'from-indigo-100/60 via-slate-50 to-slate-50' : 'from-indigo-900/40 via-slate-950 to-slate-950'
        }`}></div>
        
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
           className={`absolute -top-[100%] -left-[100%] w-[300%] h-[300%] opacity-20`}
           style={{
             backgroundImage: isLight 
                ? 'conic-gradient(from 180deg at 50% 50%, rgba(99,102,241,0) 0deg, rgba(99,102,241,0.1) 120deg, rgba(79,70,229,0.2) 180deg, rgba(99,102,241,0.1) 240deg, rgba(99,102,241,0) 360deg)'
                : 'conic-gradient(from 180deg at 50% 50%, rgba(99,102,241,0) 0deg, rgba(34,211,238,0.1) 120deg, rgba(99,102,241,0.2) 180deg, rgba(34,211,238,0.1) 240deg, rgba(99,102,241,0) 360deg)'
           }}
        />

        <div className={`absolute inset-0 bg-[size:4rem_4rem] ${
          isLight 
            ? 'bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)]' 
            : 'bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]'
        }`}>
           <motion.div 
             animate={{ y: [0, 800] }} 
             transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
             className={`absolute left-0 right-0 h-[25vh] bg-gradient-to-b ${
               isLight ? 'from-transparent via-indigo-500/5 to-transparent' : 'from-transparent via-cyan-500/5 to-transparent'
             }`} 
           />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 space-y-4"
        >
          <div className="inline-flex items-baseline space-x-3 mb-2">
            <div className={`inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium backdrop-blur-md transition-colors ${
              isLight 
                ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-700 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
            }`}>
              <span className="relative flex h-2 w-2 mr-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLight ? 'bg-indigo-400' : 'bg-cyan-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isLight ? 'bg-indigo-500' : 'bg-cyan-500'}`}></span>
              </span>
              SYSTEM ONLINE
            </div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className={`w-5 h-5 border-2 rounded-full ${isLight ? 'border-indigo-200 border-t-indigo-500' : 'border-indigo-500/50 border-t-indigo-400'}`}
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tighter mb-4">
            Open Source <span className={`text-transparent bg-clip-text bg-gradient-to-r transition-colors ${
              isLight 
                ? 'from-indigo-600 via-blue-600 to-purple-600 drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                : 'from-cyan-400 via-indigo-400 to-purple-400 drop-shadow-[0_0_25px_rgba(99,102,241,0.4)]'
            }`}>Intel</span>
          </h1>
          <p className={`text-xl max-w-2xl font-light leading-relaxed transition-colors ${
            isLight ? 'text-slate-600' : 'text-slate-400/80'
          }`}>
            Automatic daily insights into the top GitHub projects defining the AI and developer tooling landscape.
          </p>
        </motion.header>

        {loading && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex flex-col items-center justify-center py-32 space-y-8"
          >
            <div className="relative">
              <motion.div 
                animate={{ rotate: -360 }} 
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className={`absolute inset-0 inset-m-4 rounded-full border border-dashed ${isLight ? 'border-indigo-500/40' : 'border-cyan-500/40'}`}
              />
              <div className={`absolute inset-0 rounded-full blur-2xl animate-pulse ${isLight ? 'bg-indigo-500/20' : 'bg-cyan-500/30'}`}></div>
              <Loader2 className={`w-16 h-16 animate-spin relative z-10 ${isLight ? 'text-indigo-600' : 'text-cyan-400'}`} />
            </div>
            <p className={`tracking-[0.2em] uppercase text-sm font-medium animate-pulse ${isLight ? 'text-indigo-600/80' : 'text-cyan-400/80'}`}>Syncing nodes...</p>
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className={`p-6 rounded-2xl border flex flex-col items-center text-center space-y-4 backdrop-blur-md relative overflow-hidden transition-colors ${
              isLight ? 'bg-red-50/80 border-red-200' : 'bg-red-950/40 border-red-500/30'
            }`}
          >
            <motion.div 
              animate={{ x: ["-100%", "100%"] }} 
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 h-[1px] w-full bg-gradient-to-r from-transparent via-red-500 to-transparent" 
            />
            <div className={`p-3 rounded-full border ${isLight ? 'bg-red-100 border-red-200' : 'bg-red-500/10 border-red-500/20'}`}>
              <AlertCircle className={`w-8 h-8 ${isLight ? 'text-red-500' : 'text-red-400'}`} />
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-1 uppercase tracking-widest text-sm ${isLight ? 'text-red-600' : 'text-red-400'}`}>Critical Error</h3>
              <p className={`max-w-md mx-auto ${isLight ? 'text-red-500/80' : 'text-red-300/80'}`}>{error}</p>
            </div>
          </motion.div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 lg:gap-14 relative">
            {categories.map((category, idx) => (
              <CategoryPanel 
                key={category.name} 
                category={category} 
                index={idx}
                onSelectProject={setSelectedProject}
              />
            ))}
          </div>
        )}

      </div>
      
      <AnimatePresence>
        {selectedProject && (
          <SummaryModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
