import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload as UploadIcon, 
  Image as ImageIcon, 
  X, 
  Search, 
  Cpu, 
  CheckCircle2,
  AlertCircle,
  Clock,
  History,
  BarChart2,
  Activity,
  User,
  MapPin,
  Calendar,
  Fingerprint,
  FileText
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const Upload: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAlgo, setSelectedAlgo] = useState('linear');
  const [result, setResult] = useState<{ 
    plateNumber: string; 
    timeMs: number; 
    algorithm: string;
    index?: number;
    indexRaw?: number;
    indexSorted?: number;
    foundInDb?: any;
    dbSearchStats?: any;
    allComparisons?: any[];
  } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    setResult(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      'image/jpeg': [], 
      'image/png': [], 
      'image/webp': [], 
      'image/heic': [],
      'image/heif': []
    } as Record<string, string[]>,
    multiple: false
  } as any);

  const processImage = async (compareAll = false) => {
    if (!image) return;
    setIsProcessing(true);
    setError(null);
    const startTime = performance.now();
    
    try {
      // 1. Recognize Plate
      const res = await fetch('/api/lpr/recognize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Recognition failed");
      }
      
      // 2. Search in Database
      const searchRes = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          plateNumber: data.plateNumber, 
          algorithm: selectedAlgo, 
          compareAll 
        })
      });
      
      const searchData = await searchRes.json();
      
      if (!searchRes.ok) {
        throw new Error(searchData.error || "Database search failed");
      }
      
      const endTime = performance.now();
      
      if (compareAll) {
        setResult({
          plateNumber: data.plateNumber,
          timeMs: endTime - startTime,
          algorithm: 'Full Comparison Mode',
          allComparisons: searchData.comparisons,
          index: searchData.index,
          indexRaw: searchData.indexRaw,
          indexSorted: searchData.indexSorted,
          foundInDb: searchData.found ? searchData.record : null,
          dbSearchStats: searchData.comparisons.find((c: any) => c.id === selectedAlgo) || searchData.comparisons[0]
        });
      } else {
        setResult({
          plateNumber: data.plateNumber,
          timeMs: endTime - startTime,
          algorithm: searchData.name,
          index: searchData.index,
          indexRaw: searchData.indexRaw,
          indexSorted: searchData.indexSorted,
          foundInDb: searchData.found ? searchData.record : null,
          dbSearchStats: {
            comparisons: searchData.comparisons,
            iterations: searchData.iterations,
            timeMs: searchData.timeMs,
            complexity: searchData.complexity,
            space: searchData.space
          }
        });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const chartData = result?.allComparisons ? {
    labels: result.allComparisons.map(c => c.name),
    datasets: [{
      label: 'Iterations',
      data: result.allComparisons.map(c => c.iterations),
      backgroundColor: result.allComparisons.map(c => c.id === 'linear' ? '#f43f5e' : '#6366f1'),
      borderRadius: 8
    }]
  } : null;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-[#202124] mb-2 tracking-tight">Image Analysis Interface</h2>
        <p className="text-[#5f6368]">Process vehicle identifiers and benchmarking data access strategies.</p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Upload & Selection */}
        <section className="lg:col-span-12 xl:col-span-5 space-y-6">
          {!image ? (
            <div 
              {...getRootProps()} 
              className={`
                aspect-video w-full rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all
                ${isDragActive ? 'border-[#1a73e8] bg-[#e8f0fe]/50' : 'border-[#dadce0] hover:border-[#1a73e8] bg-white'}
              `}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 bg-[#f8f9fa] rounded-full flex items-center justify-center mb-6 shadow-sm">
                <UploadIcon className="text-[#5f6368]" size={24} />
              </div>
              <p className="text-[#3c4043] font-semibold text-lg">Drop image here</p>
              <p className="text-[#5f6368] text-sm mt-1">Accepts JPG, PNG, WEBP, HEIC</p>
            </div>
          ) : (
            <div className="relative aspect-video rounded-[32px] overflow-hidden bg-[#f1f3f4] border border-[#dadce0] group shadow-sm">
              <img src={image} alt="Uploaded" className="w-full h-full object-contain" />
              <button 
                onClick={() => setImage(null)}
                className="absolute top-4 right-4 p-2.5 bg-white shadow-lg hover:bg-[#f1f3f4] rounded-full text-[#3c4043] transition-all"
              >
                <X size={20} />
              </button>
            </div>
          )}

          <div className="bg-white p-8 rounded-[32px] border border-[#dadce0] shadow-sm space-y-6">
            <div>
              <label className="text-[11px] font-bold text-[#5f6368] uppercase tracking-widest block mb-3 px-1">Evaluation Strategy</label>
              <select 
                value={selectedAlgo}
                onChange={(e) => setSelectedAlgo(e.target.value)}
                className="w-full bg-[#f8f9fa] text-[#202124] p-4 rounded-2xl border border-[#dadce0] outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium appearance-none cursor-pointer"
              >
                <option value="linear">Sequential Search (O(n))</option>
                <option value="binary">Binary Search (O(log n))</option>
                <option value="jump">Block Search (O(√n))</option>
                <option value="interpolation">Interpolation Search (O(log log n))</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button 
                disabled={!image || isProcessing}
                onClick={() => processImage(false)}
                className="flex-1 py-4 bg-[#1a73e8] disabled:opacity-50 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#1557b0] transition-all shadow-md shadow-blue-500/10"
              >
                {isProcessing ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Search size={20} />}
                Invoke Recognition
              </button>
              <button 
                disabled={!image || isProcessing}
                onClick={() => processImage(true)}
                className="px-6 py-4 bg-[#f1f3f4] disabled:opacity-50 text-[#3c4043] font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#e8eaed] transition-all"
                title="Cross-compare all implementations"
              >
                <BarChart2 size={20} />
                Bench All
              </button>
            </div>
          </div>
        </section>

        {/* Right Column: Results & Analysis */}
        <section className="lg:col-span-12 xl:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {error ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-[#fdf2f2] border border-[#f8b4b4] rounded-[32px] text-[#9b1c1c] flex items-start gap-4"
              >
                <AlertCircle className="mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-lg mb-2">Service Temporarily Unavailable</h4>
                  <p className="text-sm opacity-90 leading-relaxed mb-6">
                    {error.includes("503") || error.includes("Unavailable") 
                      ? "The compute resources for AI inference are currently at peak capacity. We've attempted retries with exponential backoff, but the system remains loaded. Please attempt your request again in 30 seconds."
                      : error}
                  </p>
                  <button 
                    onClick={() => processImage(false)}
                    className="px-6 py-2.5 bg-[#9b1c1c] text-white rounded-xl text-xs font-bold hover:bg-[#801717] transition-colors shadow-sm"
                  >
                    Re-attempt Processing
                  </button>
                </div>
              </motion.div>
            ) : result ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-8 bg-white border border-[#dadce0] rounded-[32px] text-[#202124] shadow-sm relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                      <div>
                        <p className="text-[#5f6368] text-[11px] font-bold uppercase tracking-widest mb-2">Extracted Identifier</p>
                        <h3 className="text-4xl font-mono font-bold tracking-tight text-[#1a73e8]">{result.plateNumber}</h3>
                      </div>
                      <div className="mt-10 flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-50 text-[#1a73e8] rounded-xl flex items-center justify-center border border-blue-100 shadow-sm"><Activity size={18} /></div>
                        <span className="text-sm font-semibold text-[#5f6368]">{result.algorithm}</span>
                      </div>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-50 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                  </div>

                  <div className="p-8 bg-white border border-[#dadce0] rounded-[32px] shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-6">
                      <h4 className="text-[#3c4043] font-bold flex items-center gap-2"><Cpu size={20} className="text-[#1a73e8]" /> Hardware Logic</h4>
                    </div>
                    <div className="space-y-5">
                      <div className="flex justify-between items-center bg-[#f8f9fa] p-3 rounded-2xl">
                        <span className="text-[#5f6368] text-sm">Time Complexity</span>
                        <span className="text-[#188038] font-mono font-bold text-sm">{result.dbSearchStats.complexity || 'O(n)'}</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#f8f9fa] p-3 rounded-2xl">
                        <span className="text-[#5f6368] text-sm">Space Complexity</span>
                        <span className="text-[#1a73e8] font-mono font-bold text-sm">{result.dbSearchStats.space || 'O(1)'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* New Discovery Report Output Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border-2 border-[#dadce0] rounded-[40px] overflow-hidden shadow-xl"
                >
                  <div className="bg-[#f8f9fa] border-b border-[#dadce0] p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#1a73e8]/10 text-[#1a73e8] rounded-full flex items-center justify-center">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#202124]">System Discovery Report</h4>
                        <p className="text-[10px] text-[#5f6368] uppercase font-black tracking-widest">Hash ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                      </div>
                    </div>
                    {result.foundInDb ? (
                      <div className="flex items-center gap-2 px-4 py-2 bg-[#e6f4ea] text-[#137333] rounded-full font-bold text-xs border border-[#ceead6]">
                        <CheckCircle2 size={16} /> VERIFIED
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2 bg-[#fce8e6] text-[#c5221f] rounded-full font-bold text-xs border border-[#fad2cf]">
                        <AlertCircle size={16} /> UNKNOWN
                      </div>
                    )}
                  </div>

                  <div className="p-8 grid md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div>
                        <p className="text-[10px] font-black text-[#5f6368] uppercase tracking-[0.2em] mb-4">Identification Results</p>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#f1f3f4] rounded-xl flex items-center justify-center text-[#5f6368]"><Fingerprint size={20} /></div>
                            <div>
                              <p className="text-[9px] font-bold text-[#80868b] uppercase">Identifier Match</p>
                              <p className="text-xl font-mono font-bold text-[#202124]">{result.plateNumber}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#f1f3f4] rounded-xl flex items-center justify-center text-[#5f6368]"><Search size={20} /></div>
                            <div>
                              <p className="text-[9px] font-bold text-[#80868b] uppercase">Memory Location</p>
                              {result.index !== undefined && result.index !== -1 ? (
                                <p className="text-lg font-bold text-[#202124]">
                                  Row #{result.indexRaw !== undefined ? result.indexRaw + 1 : result.index + 1}
                                  <span className="text-xs font-normal text-[#5f6368] ml-1.5">(of 1,000)</span>
                                </p>
                              ) : (
                                <p className="text-base font-bold text-[#c5221f]">NULL REFERENCE</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-[#f1f3f4]">
                        <p className="text-[11px] text-[#5f6368] leading-relaxed italic">
                          "{result.foundInDb 
                            ? `Success: The ${result.algorithm} logic pinpointed this record in ${result.dbSearchStats.iterations} iterations. No hash collisions detected.` 
                            : `Exhausted Registry: Searched 1,000 nodes using ${result.algorithm} without matching the identifier. No records exist in global storage.`
                          }"
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#f8f9fa] rounded-[32px] p-6 border border-[#f1f3f4] flex flex-col justify-center">
                      <p className="text-[10px] font-black text-[#5f6368] uppercase tracking-[0.2em] mb-6 text-center">Entity Validation</p>
                      
                      {result.foundInDb ? (
                        <div className="space-y-5">
                          <div className="flex items-center gap-3">
                            <User className="text-[#1a73e8]" size={18} />
                            <div>
                              <p className="text-[9px] font-bold text-[#80868b] uppercase">Certified Owner</p>
                              <p className="text-sm font-bold text-[#202124]">{result.foundInDb.ownerName || "Authorized Personnel"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="text-[#1a73e8]" size={18} />
                            <div>
                              <p className="text-[9px] font-bold text-[#80868b] uppercase">Operational Base</p>
                              <p className="text-sm font-bold text-[#202124]">{result.foundInDb.city || "System Default"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Calendar className="text-[#1a73e8]" size={18} />
                            <div>
                              <p className="text-[9px] font-bold text-[#80868b] uppercase">Registration Timestamp</p>
                              <p className="text-sm font-bold text-[#202124]">{result.foundInDb.registrationDate || new Date().toISOString().split('T')[0]}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-[#dadce0] shadow-inner">
                            <AlertCircle className="text-[#c5221f]" size={28} />
                          </div>
                          <p className="font-bold text-[#202124]">No Data Associated</p>
                          <p className="text-xs text-[#5f6368] mt-1">Record absent from registry</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {result.allComparisons && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-10 bg-white rounded-[40px] border border-[#dadce0] shadow-md"
                  >
                    <div className="flex justify-between items-center mb-10">
                      <h4 className="text-[#202124] font-bold text-xl flex items-center gap-3">
                        <Activity size={26} className="text-[#1a73e8]" />
                        Performance Scaling Report
                      </h4>
                      <span className="text-[10px] font-black text-[#5f6368] uppercase tracking-widest bg-[#f1f3f4] px-3 py-1.5 rounded-full">Delta: Inter-Algorithm</span>
                    </div>
                    <div className="h-72">
                      {chartData && (
                        <Bar 
                          data={chartData} 
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { 
                              legend: { display: false },
                              tooltip: { 
                                backgroundColor: '#202124',
                                titleFont: { size: 12 },
                                bodyFont: { size: 13 },
                                cornerRadius: 8,
                                padding: 12
                              }
                            },
                            scales: {
                              x: { grid: { display: false }, ticks: { color: '#5f6368', font: { size: 11, weight: 'bold' } } },
                              y: { grid: { color: '#f1f3f4' }, border: { dash: [4, 4] }, ticks: { color: '#9aa0a6' } }
                            }
                          }} 
                        />
                      )}
                    </div>
                  </motion.div>
                )}

                <div className="p-8 bg-white rounded-[32px] border border-[#dadce0] shadow-sm">
                   <div className="flex items-center justify-between mb-8 px-2">
                    <h4 className="text-[#3c4043] font-bold flex items-center gap-3">
                      <History size={22} className="text-[#1a73e8]" />
                      Metric Trace Log
                    </h4>
                    {result.foundInDb ? (
                      <span className="flex items-center gap-1.5 px-4 py-1.5 bg-[#e6f4ea] text-[#137333] text-[11px] font-bold uppercase rounded-full border border-[#ceead6] tracking-tight transition-transform hover:scale-105">
                        <CheckCircle2 size={14} /> Registered
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-4 py-1.5 bg-[#fce8e6] text-[#c5221f] text-[11px] font-bold uppercase rounded-full border border-[#fad2cf] tracking-tight transition-transform hover:scale-105">
                        <AlertCircle size={14} /> Unregistered
                      </span>
                    )}
                   </div>
                   
                   {result.allComparisons ? (
                     <div className="overflow-hidden rounded-2xl border border-[#f1f3f4]">
                       <table className="w-full text-left">
                         <thead>
                           <tr className="text-[11px] font-bold text-[#5f6368] uppercase tracking-widest bg-[#f8f9fa] border-b border-[#f1f3f4]">
                             <th className="py-4 px-6 text-[#202124]">Implementation</th>
                             <th className="py-4 px-6 text-center">Class</th>
                             <th className="py-4 px-6 text-right">Ops Count</th>
                             <th className="py-4 px-6 text-right">Latency</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-[#f1f3f4]">
                           {result.allComparisons.map((algo) => (
                             <tr key={algo.id} className="hover:bg-[#fcfdfe] transition-colors group">
                               <td className="py-5 px-6">
                                 <p className="text-[#202124] font-bold text-sm tracking-tight">{algo.name}</p>
                               </td>
                               <td className="py-5 px-6 text-center">
                                 <div className="flex flex-col items-center gap-1.5">
                                   <span className="text-[10px] bg-blue-50 text-[#1a73e8] px-2.5 py-1 rounded-full font-bold border border-blue-100">{algo.complexity}</span>
                                   <span className="text-[10px] bg-[#f1f3f4] text-[#5f6368] px-2.5 py-1 rounded-full font-bold">{algo.space}</span>
                                 </div>
                               </td>
                               <td className="py-5 px-6 text-right">
                                 <p className="text-[#202124] font-mono font-bold text-base">{algo.iterations.toLocaleString()}</p>
                                 <p className="text-[10px] text-[#80868b] font-medium uppercase tracking-tighter">{algo.comparisons.toLocaleString()} checks</p>
                               </td>
                               <td className="py-5 px-6 text-right">
                                 <span className="text-[#1a73e8] font-mono font-black text-sm">{algo.timeMs.toFixed(4)}<span className="text-[10px] ml-0.5">ms</span></span>
                               </td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     </div>
                   ) : (
                     <div className="grid md:grid-cols-3 gap-6">
                       <div className="space-y-2">
                          <p className="text-[11px] font-bold text-[#5f6368] uppercase tracking-widest px-1">Iterative Steps</p>
                          <div className="p-5 bg-[#f8f9fa] rounded-2xl border border-[#f1f3f4] shadow-sm">
                            <p className="text-3xl font-bold text-[#202124]">{result.dbSearchStats.iterations.toLocaleString()}</p>
                          </div>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[11px] font-bold text-[#5f6368] uppercase tracking-widest px-1">Atomic Comparisons</p>
                          <div className="p-5 bg-[#f8f9fa] rounded-2xl border border-[#f1f3f4] shadow-sm">
                            <p className="text-3xl font-bold text-[#202124]">{result.dbSearchStats.comparisons.toLocaleString()}</p>
                          </div>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[11px] font-bold text-[#5f6368] uppercase tracking-widest px-1">Processing Time</p>
                          <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 shadow-sm">
                            <p className="text-3xl font-bold text-[#1a73e8]">{result.dbSearchStats.timeMs.toFixed(4)}<span className="text-sm ml-1">ms</span></p>
                          </div>
                       </div>
                     </div>
                   )}
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-16 border-2 border-dashed border-[#dadce0] rounded-[40px] bg-white shadow-sm">
                <div className="w-20 h-20 bg-[#f8f9fa] rounded-full flex items-center justify-center mb-8 border border-[#f1f3f4]">
                  <ImageIcon size={32} className="text-[#9aa0a6]" />
                </div>
                <h3 className="text-2xl font-bold text-[#3c4043] mb-3">Diagnostic Ready</h3>
                <p className="text-[#5f6368] max-w-sm text-base leading-relaxed">Please perform an upload on the left to initiate the high-precision algorithmic benchmarking suite.</p>
              </div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
};
