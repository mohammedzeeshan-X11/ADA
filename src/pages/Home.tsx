import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Zap, Search, Clock, BookOpen, Code, Layers, Info, Check, HelpCircle } from 'lucide-react';

interface ComplexityCard {
  id: string;
  name: string;
  best: string;
  avg: string;
  worst: string;
  space: string;
  description: string;
  precondition: string;
}

export const Home: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const [selectedAlgo, setSelectedAlgo] = useState<string>('binary');

  const algorithms: ComplexityCard[] = [
    {
      id: 'linear',
      name: 'Linear Search',
      best: 'O(1)',
      avg: 'O(n)',
      worst: 'O(n)',
      space: 'O(1)',
      precondition: 'None (Works on unsorted/arbitrary lists)',
      description: 'Scans each node sequentially from index 0 across the entire memory vector. It is highly resilient because it demands zero structural prep work, but execution scaling scales linearly with list dimensions.'
    },
    {
      id: 'binary',
      name: 'Binary Search',
      best: 'O(1)',
      avg: 'O(log n)',
      worst: 'O(log n)',
      space: 'O(1)',
      precondition: 'Sorted dataset order constraint',
      description: 'Employs a divide-and-conquer strategy, bisecting the interval range with each iteration based on midpoint comparisons. Scales exceptionally well in massive registry frameworks.'
    },
    {
      id: 'jump',
      name: 'Jump (Block) Search',
      best: 'O(1)',
      avg: 'O(√n)',
      worst: 'O(√n)',
      space: 'O(1)',
      precondition: 'Sorted dataset order constraint',
      description: 'Steps ahead by a fixed interval block size (optimal: √n), jumping forward to spot target bounds. Once passed, it performs a brief backward linear scan to isolate the actual record.'
    },
    {
      id: 'interpolation',
      name: 'Interpolation Search',
      best: 'O(1)',
      avg: 'O(log log n)',
      worst: 'O(n)',
      space: 'O(1)',
      precondition: 'Sorted array + Uniform numerical distribution',
      description: 'An advanced calculated-access algorithm that guesses target placement based on numeric densities (like looking up "Z" in a dictionary). Yields ultra-fast speeds on highly balanced indices but degrades under skewed distributions.'
    }
  ];

  const currentAlgo = algorithms.find(a => a.id === selectedAlgo) || algorithms[1];

  return (
    <div className="max-w-6xl mx-auto py-16 px-6 space-y-28">
      {/* 1. HERO SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <span className="px-5 py-2 bg-blue-50 text-[#1967d2] text-xs font-bold uppercase tracking-widest rounded-full border border-blue-100 mb-8 inline-block shadow-sm">
          Subject: Multimodal Extraction & Index Matching
        </span>
        <h1 className="text-5xl md:text-7xl font-bold text-[#202124] mb-8 tracking-tight leading-tight">
          License Plate Recognition System <br />
          <span className="text-[#1a73e8]">With Search Benchmarking</span>
        </h1>
        <p className="text-[#5f6368] text-xl max-w-3xl mx-auto mb-12 leading-relaxed font-normal">
          Empirically test time and space complexity across massive, structured license plate registries. 
          Deconstruct the performance curves of fundamental computational search routines.
        </p>
        <button 
          onClick={onStart}
          className="px-10 py-4 bg-[#1a73e8] text-white font-bold rounded-full shadow-lg shadow-blue-500/20 hover:bg-[#1557b0] hover:scale-[1.02] transition-all flex items-center gap-3 mx-auto"
        >
          <Zap size={18} fill="currentColor" />
          Start Analysis System
        </button>
      </motion.div>

      {/* 2. CHIP-BASED CORE FEATURES GRID */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {[
          { 
            title: 'Multimodal Extraction', 
            desc: 'Leveraging Gemini Flash API for highly accurate license plate tokenization from scanned images.',
            icon: Shield,
            color: 'bg-blue-600',
            iconColor: 'text-blue-600'
          },
          { 
            title: 'Search Benchmarking', 
            desc: 'Linear, Binary, Jump, and Interpolation search strategies compared side-by-side with microscopic precision.',
            icon: Search,
            color: 'bg-indigo-600',
            iconColor: 'text-indigo-600'
          },
          { 
            title: 'Complexity & Scale', 
            desc: 'Track practical execution times, iteration loops, and key comparisons to observe algorithmic growth.',
            icon: Clock,
            color: 'bg-orange-600',
            iconColor: 'text-orange-600'
          },
          { 
            title: 'Live Registry', 
            desc: 'Demonstrate search performance across persistent datasets containing up to 5,000 unique records.',
            icon: Database,
            color: 'bg-rose-600',
            iconColor: 'text-rose-600'
          }
        ].map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * idx }}
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

      {/* 3. ASYMPTOTIC COMPLEXITY MATRIX PLAYGROUND (Interactive Time/Space Complexity Section) */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-5xl mx-auto bg-white border border-[#dadce0] rounded-[48px] overflow-hidden shadow-2xl p-8 md:p-12 space-y-10"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#f1f3f4] pb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-2.5 h-2.5 bg-[#1a73e8] rounded-full animate-ping" />
              <p className="text-[10px] uppercase font-black text-[#1a73e8] tracking-widest">Asymptotic Complexity Reference</p>
            </div>
            <h2 className="text-3xl font-bold text-[#202124]">Searching Complexity Matrix</h2>
            <p className="text-[#5f6368] text-sm mt-1">Select an active lookup algorithm to explore its algorithmic bounds & memory profiles.</p>
          </div>
          
          <div className="flex flex-wrap gap-2.5 bg-[#f8f9fa] p-1.5 rounded-2xl border border-[#dadce0]">
            {algorithms.map(algo => (
              <button
                key={algo.id}
                onClick={() => setSelectedAlgo(algo.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                  selectedAlgo === algo.id 
                    ? 'bg-white text-[#1a73e8] shadow-sm font-bold border border-[#dadce0]/50' 
                    : 'text-[#5f6368] hover:text-[#202124]'
                }`}
              >
                {algo.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Interactive Complexity Details Card */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-[#f8f9fa] border border-[#dadce0] rounded-[32px] p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-[#202124]">{currentAlgo.name}</h3>
                <span className="px-4 py-1.5 bg-[#e8f0fe] text-[#1967d2] text-xs font-bold rounded-full border border-[#d2e3fc]">
                   Auxiliary Space: {currentAlgo.space}
                </span>
              </div>
              
              <p className="text-[#5f6368] text-[15px] leading-relaxed font-normal">
                {currentAlgo.description}
              </p>

              <div className="pt-4 border-t border-[#dadce0] flex items-center gap-2.5 text-xs text-[#5f6368]">
                <Info size={16} className="text-[#1a73e8]" />
                <span className="font-semibold">Required Index Precondition:</span>
                <span className="font-mono text-[#202124] bg-white px-2.5 py-1 rounded-md border border-[#dadce0] text-[11px]">
                  {currentAlgo.precondition}
                </span>
              </div>
            </div>
          </div>

          {/* Time & Space Complexity Big Metrics */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-4 h-full">
              {[
                { label: 'Time Complexity (Best Case)', val: currentAlgo.best, desc: 'O(1) if first node loaded holds target data', color: 'text-emerald-600 bg-emerald-50/50 border-emerald-100' },
                { label: 'Time Complexity (Average)', val: currentAlgo.avg, desc: 'Empirical benchmark expectation under scale', color: 'text-[#1a73e8] bg-[#e8f0fe]/30 border-blue-100' },
                { label: 'Time Complexity (Worst Case)', val: currentAlgo.worst, desc: 'Max computation loop iterations to search array', color: 'text-[#c5221f] bg-[#fce8e6]/40 border-red-100' },
                { label: 'Space Complexity (Worst Case)', val: currentAlgo.space, desc: 'Auxiliary stack frame overhead', color: 'text-gray-700 bg-[#f8f9fa] border-[#dadce0]' }
              ].map((item, id) => (
                <div key={id} className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${item.color}`}>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-wider opacity-70 mb-1">{item.label}</p>
                    <p className="text-2xl font-mono font-black">{item.val}</p>
                    <p className="text-[10px] opacity-60 mt-0.5">{item.desc}</p>
                  </div>
                  <HelpCircle size={18} className="opacity-30 self-start mt-0.5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* 4. COMPREHENSIVE ACADEMIC DOCUMENTATION / DOCUMENTARY SECTION */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="border-t border-[#dadce0] pt-24 max-w-5xl mx-auto space-y-16"
      >
        <div className="text-center space-y-4">
          <div className="inline-flex p-3 bg-blue-50 text-[#1a73e8] rounded-2xl mb-2">
            <BookOpen size={28} />
          </div>
          <h2 className="text-4xl font-bold text-[#202124] tracking-tight">Academic Thesis Context</h2>
          <p className="text-[#5f6368] text-lg max-w-2xl mx-auto">
            Review the conceptual objectives, system implementations, and standard computational bounds of this laboratory utility.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-10 bg-white rounded-[40px] border border-[#dadce0] shadow-sm hover:shadow-md transition-shadow">
            <Code className="text-[#1a73e8] mb-8" size={36} />
            <h4 className="text-xl font-bold text-[#202124] mb-4">Manual Architecture</h4>
            <p className="text-[#5f6368] text-[15px] leading-relaxed mb-6">
              To preserve academic integrity, 100% of the active searching indices and math routines are built completely from scratch without native library shortcuts.
              Pointers, jumping algorithms, and partition bounds are explicitly manual to capture low-level computational overhead.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="px-3 py-1 bg-blue-50 text-[#1a73e8] rounded-full border border-blue-100">Boundary Math</span>
              <span className="px-3 py-1 bg-blue-50 text-[#1a73e8] rounded-full border border-blue-100">Zero Library Dependencies</span>
            </div>
          </div>

          <div className="p-10 bg-white rounded-[40px] border border-[#dadce0] shadow-sm hover:shadow-md transition-shadow">
            <Layers className="text-[#188038] mb-8" size={36} />
            <h4 className="text-xl font-bold text-[#202124] mb-4">Metric Telemetry Aggregator</h4>
            <p className="text-[#5f6368] text-[15px] leading-relaxed mb-6">
              We log precise operational traces across comparisons and iteration steps. Real-time CPU performance tracking reveals exactly where theoretical execution equations cross lines with architectural latency.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="px-3 py-1 bg-[#f4fffa] text-[#137333] rounded-full border border-[#d5f5e3]">Iteration Counter</span>
              <span className="px-3 py-1 bg-[#f4fffa] text-[#137333] rounded-full border border-[#d5f5e3]">High-Precision Time stamps</span>
            </div>
          </div>
        </div>

        <div className="bg-[#1a73e8] rounded-[48px] p-10 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-blue-500/10">
          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="px-4 py-1.5 bg-white/20 text-white text-[11px] uppercase font-black tracking-widest rounded-full border border-white/10">Practical Data Utility</span>
            <h3 className="text-3xl font-bold tracking-tight">How Multimodal Intelligence Powers The Benchmarks</h3>
            <p className="text-blue-100 text-base leading-relaxed leading-relaxed font-medium">
              We leverage advanced LLM multimodal capabilities to extract real-world plate characters. 
              The raw characters are fed instantiately to our search models to evaluate lookup behaviors across balanced vs. highly non-uniform indices. 
              This provides a clear comparison between $O(\log n)$ and $O(\log \log n)$ asymptotic curves with real data.
            </p>
            <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10 text-xs font-bold uppercase tracking-wider">
              <div className="bg-white/10 px-5 py-3 rounded-2xl border border-white/20">
                <p className="text-white/50 text-[9px] mb-1">OCR Model Core</p>
                <p>Gemini 1.5 Flash</p>
              </div>
              <div className="bg-white/10 px-5 py-3 rounded-2xl border border-white/20">
                <p className="text-white/50 text-[9px] mb-1">Database Scope Max</p>
                <p>5,000 Entries</p>
              </div>
            </div>
          </div>
          {/* Accent decoration overlay */}
          <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/4 w-[450px] h-[450px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
        </div>
      </motion.section>
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

