import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { motion } from 'motion/react';
import { Zap, Clock, Activity, TrendingUp, BarChart2 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/benchmark')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Filter data for charts
  const quickSortData = data.filter(d => d.label === 'Quick Sort');
  const bubbleSortData = data.filter(d => d.label === 'Bubble Sort');

  const lineChartData = {
    labels: ['500 records', '1000 records', '5000 records'],
    datasets: [
      {
        label: 'Quick Sort (O(n log n))',
        data: quickSortData.map(d => d.time),
        borderColor: '#1a73e8',
        backgroundColor: 'rgba(26, 115, 232, 0.05)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Bubble Sort (O(n²))',
        data: bubbleSortData.map(d => d.skipped ? null : d.time),
        borderColor: '#d93025',
        backgroundColor: 'rgba(217, 48, 37, 0.05)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const comparisonsChartData = {
    labels: ['Quick Sort', 'Bubble Sort'],
    datasets: [
      {
        label: 'Comparisons (1000 records)',
        data: [
          data.find(d => d.label === 'Quick Sort' && d.size === 1000)?.comparisons || 0,
          data.find(d => d.label === 'Bubble Sort' && d.size === 1000)?.comparisons || 0
        ],
        backgroundColor: ['#1a73e8', '#d93025'],
        borderRadius: 12
      }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-[#202124] mb-2 tracking-tight">Performance Analytics</h2>
          <p className="text-[#5f6368]">Benchmarking algorithmic scalability and hardware efficiency metrics.</p>
        </div>
        <div className="hidden md:flex gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#dadce0] flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 bg-[#e8f0fe] rounded-xl flex items-center justify-center text-[#1a73e8]">
              <Zap size={22} fill="currentColor" />
            </div>
            <div>
              <p className="text-[11px] uppercase font-bold text-[#5f6368] tracking-widest mb-0.5">Peak Algorithm</p>
              <p className="text-[#202124] font-bold text-lg">Quick Sort</p>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Time Category', val: 'O(n log n)', sub: 'Average Load', icon: Clock, color: 'text-[#1a73e8]', bg: 'bg-blue-50' },
          { label: 'Storage Class', val: 'O(log n)', sub: 'Memory Stack', icon: Activity, color: 'text-[#188038]', bg: 'bg-green-50' },
          { label: 'Op Throughput', val: '14K Checks', sub: 'per 1K records', icon: TrendingUp, color: 'text-[#f29900]', bg: 'bg-orange-50' },
          { label: 'Scaling Index', val: 'Logarithmic', sub: 'Growth Curve', icon: Activity, color: 'text-[#a142f4]', bg: 'bg-purple-50' }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-white rounded-[32px] border border-[#dadce0] shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
              <stat.icon size={22} />
            </div>
            <p className="text-[11px] font-bold text-[#5f6368] uppercase tracking-widest mb-2">{stat.label}</p>
            <p className="text-2xl font-black text-[#202124] tracking-tight">{stat.val}</p>
            <p className="text-[10px] text-[#80868b] mt-1.5 uppercase font-bold">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Growth Graph */}
        <div className="p-10 bg-white rounded-[40px] border border-[#dadce0] shadow-sm">
          <h3 className="text-[#202124] font-bold mb-10 text-xl flex items-center gap-3">
             <TrendingUp size={24} className="text-[#1a73e8]" />
             Temporal Scalability Matrix
          </h3>
          <div className="aspect-[4/3] w-full">
            <Line 
              data={lineChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: '#3c4043', font: { weight: 'bold', size: 11 } } } },
                scales: {
                  x: { grid: { display: false }, ticks: { color: '#5f6368', font: { size: 11 } } },
                  y: { border: { dash: [4, 4] }, grid: { color: '#f1f3f4' }, ticks: { color: '#9aa0a6' } }
                }
              }} 
            />
          </div>
        </div>

        {/* Comparisons Bar */}
        <div className="p-10 bg-white rounded-[40px] border border-[#dadce0] shadow-sm">
          <h3 className="text-[#202124] font-bold mb-10 text-xl flex items-center gap-3">
            <BarChart2 size={24} className="text-[#1a73e8]" />
            Atomic Operations Count
          </h3>
          <div className="aspect-[4/3] w-full">
            <Bar 
              data={comparisonsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { display: false }, ticks: { color: '#3c4043', font: { weight: 'bold' } } },
                  y: { border: { dash: [4, 4] }, grid: { color: '#f1f3f4' }, ticks: { color: '#9aa0a6' } }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
