import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Code, Layers, ShieldCheck, Database as DbIcon, Activity } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <header className="mb-20">
        <h2 className="text-5xl font-bold text-[#202124] mb-6 tracking-tight">Project Documentation</h2>
        <p className="text-[#5f6368] text-xl font-normal leading-relaxed">
          Comprehensive analysis of the Data Structures and Algorithms integrated within the PlateAnalyzer architecture.
        </p>
      </header>

      <div className="space-y-16">
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-50 text-[#1a73e8] rounded-2xl flex items-center justify-center border border-blue-100">
              <BookOpen size={24} />
            </div>
            <h3 className="text-2xl font-bold text-[#202124] tracking-tight">Academic Thesis</h3>
          </div>
          <div className="prose prose-blue max-w-none">
            <p className="text-[#5f6368] text-lg leading-relaxed">
              This system serves as a standardized utility for the subject <strong>"Data Structures and Algorithm Analysis"</strong>. 
              The infrastructure's core intent is to bridge the gap between theoretical Big O notation and empirical hardware execution results 
              using License Plate Tokenization as a primary data source.
            </p>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <div className="p-10 bg-white rounded-[40px] border border-[#dadce0] shadow-sm hover:shadow-md transition-shadow">
            <Code className="text-[#1a73e8] mb-8" size={36} />
            <h4 className="text-xl font-bold text-[#202124] mb-4">Manual Architecture</h4>
            <p className="text-[#5f6368] text-[15px] leading-relaxed mb-6">
              To preserve academic integrity, 100% of the searching logic is implemented manually. 
              Advanced indexes, boundary calculations, and interval estimations are custom-built to expose low-level complexity.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-50 text-[#1a73e8] text-[10px] font-bold uppercase rounded-full border border-blue-100">Custom B-Search</span>
              <span className="px-3 py-1 bg-blue-50 text-[#1a73e8] text-[10px] font-bold uppercase rounded-full border border-blue-100">Jump-Step Logic</span>
            </div>
          </div>

          <div className="p-10 bg-white rounded-[40px] border border-[#dadce0] shadow-sm hover:shadow-md transition-shadow">
            <Layers className="text-[#188038] mb-8" size={36} />
            <h4 className="text-xl font-bold text-[#202124] mb-4">Metric Aggregation</h4>
            <p className="text-[#5f6368] text-[15px] leading-relaxed mb-6">
              The benchmarking engine captures high-precision telemetry across multiple dimensions to produce a definitive efficiency score.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[#dadce0]">
                <p className="text-[9px] font-black text-[#5f6368] uppercase tracking-tighter mb-1">Compute</p>
                <p className="text-xs font-bold text-[#202124]">Instruction Cycles</p>
              </div>
              <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[#dadce0]">
                <p className="text-[9px] font-black text-[#5f6368] uppercase tracking-tighter mb-1">Spatial</p>
                <p className="text-xs font-bold text-[#202124]">Heap Allocation</p>
              </div>
            </div>
          </div>
        </section>

        <section className="p-10 bg-[#1a73e8] rounded-[48px] text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
          <div className="relative z-10">
            <Activity className="mb-8 opacity-60" size={48} />
            <h4 className="text-3xl font-bold mb-6 tracking-tight">Computational Viability</h4>
            <p className="text-white/90 text-lg leading-relaxed mb-10 max-w-2xl font-medium">
              By utilizing millions of generated registration records, the solution effectively visualizes 
              asymptotic bottlenecks. This reveals how logarithmic growth scales significantly better 
              than quadratic complexity in high-volume traffic management systems.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
                <p className="text-[10px] uppercase font-black text-white/50 mb-1 tracking-widest">Inference Core</p>
                <p className="font-bold text-lg">AI Multimodal</p>
              </div>
              <div className="bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
                <p className="text-[10px] uppercase font-black text-white/50 mb-1 tracking-widest">Dataset Max</p>
                <p className="font-bold text-lg">5,000 Nodes</p>
              </div>
            </div>
          </div>
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[300px] h-[300px] bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
        </section>

        <section className="text-center py-16 border-t border-[#dadce0]">
          <p className="text-[#5f6368] text-[11px] uppercase font-black tracking-[0.3em] mb-10">System Architecture Components</p>
          <div className="flex flex-wrap justify-center gap-10">
             <div className="flex items-center gap-3 text-[#3c4043] group cursor-default">
               <div className="p-2.5 bg-[#f1f3f4] rounded-full group-hover:bg-[#e8f0fe] transition-colors"><DbIcon size={18} className="group-hover:text-[#1a73e8]" /></div>
               <span className="font-bold text-sm">Indexed Storage</span>
             </div>
             <div className="flex items-center gap-3 text-[#3c4043] group cursor-default">
               <div className="p-2.5 bg-[#f1f3f4] rounded-full group-hover:bg-[#e8f0fe] transition-colors"><Code size={18} className="group-hover:text-[#1a73e8]" /></div>
               <span className="font-bold text-sm">Native ESNext</span>
             </div>
             <div className="flex items-center gap-3 text-[#3c4043] group cursor-default">
               <div className="p-2.5 bg-[#f1f3f4] rounded-full group-hover:bg-[#e8f0fe] transition-colors"><Activity size={18} className="group-hover:text-[#1a73e8]" /></div>
               <span className="font-bold text-sm">Canvas-2D Vitals</span>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};
