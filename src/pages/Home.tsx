import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Search, LayoutGrid, Clock, ChartBar } from 'lucide-react';

export const Home: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="max-w-6xl mx-auto py-16 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <span className="px-5 py-2 bg-blue-50 text-[#1967d2] text-xs font-bold uppercase tracking-widest rounded-full border border-blue-100 mb-8 inline-block shadow-sm">
          A Comprehensive Implementation for DSA
        </span>
        <h1 className="text-5xl md:text-7xl font-bold text-[#202124] mb-8 tracking-tight leading-tight">
          Benchmark Your Algorithms <br />
          <span className="text-[#1a73e8]">In Real Time</span>
        </h1>
        <p className="text-[#5f6368] text-xl max-w-3xl mx-auto mb-12 leading-relaxed font-normal">
          Evaluate time and space complexity across massive vehicle registration datasets. 
          Analyze performance curves and visualize instruction pointers in action.
        </p>
        <button 
          onClick={onStart}
          className="px-10 py-4 bg-[#1a73e8] text-white font-bold rounded-full shadow-lg shadow-blue-500/20 hover:bg-[#1557b0] hover:scale-[1.02] transition-all flex items-center gap-3 mx-auto"
        >
          <Zap size={18} fill="currentColor" />
          Start Analysis System
        </button>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { 
            title: 'Multimodal Extraction', 
            desc: 'Leveraging Gemini Flash API for highly accurate license plate tokenization from images.',
            icon: Shield,
            color: 'bg-blue-600',
            iconColor: 'text-blue-600'
          },
          { 
            title: 'Search Benchmarking', 
            desc: 'Linear, Binary, Jump, and Interpolation search strategies compared side-by-side.',
            icon: Search,
            color: 'bg-indigo-600',
            iconColor: 'text-indigo-600'
          },
          { 
            title: 'Sorting Pedigree', 
            desc: 'Comprehensive execution reports on Quick, Merge, and Heap sorts at various data scales.',
            icon: ChartBar,
            color: 'bg-purple-600',
            iconColor: 'text-purple-600'
          },
          { 
            title: 'Visual Diagnostics', 
            desc: 'Live animated walkthroughs of algorithm loops, comparisons, and memory swaps.',
            icon: LayoutGrid,
            color: 'bg-emerald-600',
            iconColor: 'text-emerald-600'
          },
          { 
            title: 'Scale & Growth', 
            desc: 'Analysis of empirical data vs theoretical asymptotic notation (Big O).',
            icon: Clock,
            color: 'bg-orange-600',
            iconColor: 'text-orange-600'
          },
          { 
            title: 'Live Database', 
            desc: 'Simulated high-concurrency environments with up to 5,000 active records.',
            icon: Database,
            color: 'bg-rose-600',
            iconColor: 'text-rose-600'
          }
        ].map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="p-10 bg-white rounded-[32px] border border-[#dadce0] hover:shadow-xl hover:-translate-y-1 transition-all group shadow-sm"
          >
            <div className={`w-14 h-14 ${feature.color} bg-opacity-5 ${feature.iconColor} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
              <feature.icon size={26} />
            </div>
            <h3 className="text-xl font-bold text-[#202124] mb-4">{feature.title}</h3>
            <p className="text-[#5f6368] text-sm leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Database = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <ellipse cx="12" cy="5" rx="9" ry="3"/>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </svg>
);
