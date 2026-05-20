import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, StepForward, ChevronRight } from 'lucide-react';

interface SortStep {
  array: number[];
  comparing: number[];
  swapping: number[];
  pivot?: number;
  i?: number;
  j?: number;
}

export const Visualization: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [algo, setAlgo] = useState<'bubble' | 'selection'>('bubble');
  const timerRef = useRef<any>(null);

  const generateRandomArray = () => {
    const newArr = Array.from({ length: 15 }, () => Math.floor(Math.random() * 80) + 15);
    setArray(newArr);
    setCurrentStep(0);
    setIsPlaying(false);
    calculateSteps(newArr, algo);
  };

  const calculateSteps = (initial: number[], type: string) => {
    const s: SortStep[] = [{ array: [...initial], comparing: [], swapping: [] }];
    const arr = [...initial];

    if (type === 'bubble') {
      for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
          s.push({ array: [...arr], comparing: [j, j + 1], swapping: [], i, j });
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            s.push({ array: [...arr], comparing: [], swapping: [j, j + 1], i, j });
          }
        }
      }
    } else if (type === 'selection') {
      for (let i = 0; i < arr.length - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < arr.length; j++) {
          s.push({ array: [...arr], comparing: [minIdx, j], swapping: [], i, j });
          if (arr[j] < arr[minIdx]) {
            minIdx = j;
          }
        }
        if (minIdx !== i) {
          [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
          s.push({ array: [...arr], comparing: [], swapping: [i, minIdx], i });
        }
      }
    }

    s.push({ array: [...arr], comparing: [], swapping: [] });
    setSteps(s);
  };

  useEffect(() => {
    generateRandomArray();
  }, [algo]);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      timerRef.current = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 150);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStep, steps]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const current = steps[currentStep] || { array: [], comparing: [], swapping: [] };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <header className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-[#202124] mb-3 tracking-tight">Step-by-Step Logistics</h2>
        <p className="text-[#5f6368] text-lg">Observing the micro-instructions of low-level sorting routines.</p>
      </header>

      {/* Controls - Google Style */}
      <div className="flex flex-wrap items-center justify-center gap-8 mb-16 py-6 px-12 bg-white rounded-full border border-[#dadce0] shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-[#5f6368] uppercase tracking-widest">Routine:</span>
          <select 
            value={algo}
            onChange={(e) => setAlgo(e.target.value as any)}
            className="bg-[#f8f9fa] text-[#202124] text-sm px-5 py-2.5 rounded-full outline-none focus:ring-4 focus:ring-blue-100 border border-[#dadce0] font-medium appearance-none min-w-[160px] text-center"
          >
            <option value="bubble">Bubble Sort</option>
            <option value="selection">Selection Sort</option>
          </select>
        </div>

        <div className="h-8 w-px bg-[#dadce0]" />

        <div className="flex items-center gap-4">
          <button 
            onClick={reset}
            className="p-3.5 bg-white text-[#5f6368] border border-[#dadce0] rounded-full hover:bg-[#f8f9fa] transition-all shadow-sm"
            title="Return to T0"
          >
            <RotateCcw size={18} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-14 h-14 bg-[#1a73e8] text-white rounded-full flex items-center justify-center hover:bg-[#1557b0] shadow-lg shadow-blue-500/20 transition-all transform active:scale-95"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>

          <button 
            onClick={() => currentStep < steps.length - 1 && setCurrentStep(s => s+1)}
            className="p-3.5 bg-white text-[#5f6368] border border-[#dadce0] rounded-full hover:bg-[#f8f9fa] transition-all shadow-sm"
            title="Single Increment"
          >
            <StepForward size={18} />
          </button>
        </div>

        <div className="h-8 w-px bg-[#dadce0]" />

        <button 
          onClick={generateRandomArray}
          className="text-[11px] font-bold text-[#1a73e8] uppercase tracking-widest hover:bg-blue-50 px-5 py-2.5 rounded-full transition-all border border-blue-100"
        >
          Remap Memory
        </button>
      </div>

      {/* Visual Canvas - Professional Bars */}
      <div className="relative h-72 flex items-end justify-center gap-2.5 mb-16 px-10">
        {current.array.map((val, idx) => {
          const isComparing = current.comparing.includes(idx);
          const isSwapping = current.swapping.includes(idx);
          
          return (
            <motion.div
              layout
              key={idx + '-' + val}
              initial={false}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              style={{ height: `${val}%` }}
              className={`
                flex-1 max-w-[44px] rounded-t-xl relative group transition-all duration-300
                ${isComparing ? 'bg-[#fbbc04] shadow-[0_4px_15px_rgba(251,188,4,0.3)]' : 
                  isSwapping ? 'bg-[#ea4335] shadow-[0_4px_15px_rgba(234,67,53,0.3)]' : 
                  'bg-[#e8f0fe] border-t-2 border-[#1a73e8] hover:bg-[#d2e3fc]'}
              `}
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[#202124] text-[11px] px-2.5 py-1 rounded-lg font-bold text-white pointer-events-none shadow-md">
                Idx {idx}: {val}
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-[#5f6368] font-black opacity-50 group-hover:opacity-100">
                {idx}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend - Google Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="p-8 bg-white border border-[#dadce0] rounded-[32px] shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-4 h-4 bg-[#fbbc04] rounded-full shadow-sm" />
            <span className="text-sm font-bold text-[#3c4043] uppercase tracking-wide">Analysis State</span>
          </div>
          <p className="text-sm text-[#5f6368] leading-relaxed">The algorithm is currently evaluating the relationship between values at these indices.</p>
        </div>
        <div className="p-8 bg-white border border-[#dadce0] rounded-[32px] shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-4 h-4 bg-[#ea4335] rounded-full shadow-sm" />
            <span className="text-sm font-bold text-[#3c4043] uppercase tracking-wide">Memory Transfer</span>
          </div>
          <p className="text-sm text-[#5f6368] leading-relaxed">Condition satisfied (Violation of Order). Executing swap on the active memory stack.</p>
        </div>
        <div className="p-8 bg-[#e8f0fe] border border-blue-100 rounded-[32px] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-[#1a73e8] uppercase tracking-wide">Instruction Log</span>
            <span className="text-[11px] font-mono font-bold text-[#1967d2] bg-white/50 px-2 py-0.5 rounded-full">{currentStep} / {steps.length - 1}</span>
          </div>
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap bg-white/50 p-2.5 rounded-xl border border-white/80">
             <ChevronRight size={14} className="text-[#1a73e8]" />
             <span className="text-[11px] font-mono font-bold text-[#185abc]">
               {current.comparing.length > 0 ? `CMP(${current.array[current.comparing[0]]}, ${current.array[current.comparing[1]]})` : 
                current.swapping.length > 0 ? `SWP(PTR_${current.swapping[0]}, PTR_${current.swapping[1]})` : 
                'IDLE_WAIT'}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};
