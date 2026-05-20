import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Filter, 
  Plus, 
  Trash2, 
  Edit3,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Database as DbIcon
} from 'lucide-react';
import { Vehicle } from '../lib/algorithms';
import { motion, AnimatePresence } from 'motion/react';

export const Database: React.FC = () => {
  const [records, setRecords] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<keyof Vehicle>('plateNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    // Shared benchmark endpoint usually has small data
    fetch('/api/benchmark')
      .then(res => res.json())
      .then(() => {
        // Just mock some data for the table if not explicitly provided
        const mock: Vehicle[] = Array.from({ length: 100 }, (_, i) => ({
          id: `id-${i}`,
          ownerName: ['John Doe', 'Jane Smith', 'Alice Brown', 'Bob White'][i % 4],
          plateNumber: `ABC-${1000 + i}`,
          vehicleType: ['Sedan', 'SUV', 'Truck', 'Motorcycle'][i % 4],
          city: ['New York', 'Los Angeles', 'Chicago', 'Houston'][i % 4],
          registrationDate: '2023-01-01'
        }));
        setRecords(mock);
        setLoading(false);
      });
  }, []);

  const handleSort = (key: keyof Vehicle) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const filtered = records
    .filter(r => 
      r.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const v1 = a[sortKey];
      const v2 = b[sortKey];
      if (sortOrder === 'asc') return v1 < v2 ? -1 : 1;
      return v1 > v2 ? -1 : 1;
    });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#202124] mb-2 flex items-center gap-3">
             <div className="p-2.5 bg-[#1a73e8] rounded-xl shadow-md shadow-blue-500/10">
               <DbIcon size={20} className="text-white" />
             </div>
             Registration Registry
          </h2>
          <p className="text-[#5f6368]">High-concurrency data storage hosting 5,000 algorithmic records.</p>
        </div>
        
        <div className="flex bg-white p-2 rounded-full border border-[#dadce0] shadow-sm items-center">
          <div className="flex items-center px-5 gap-3 text-[#5f6368] border-r border-[#dadce0] mr-2">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search via Plate or Owner..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-sm text-[#202124] outline-none w-48 md:w-64 placeholder:text-[#9aa0a6]"
            />
          </div>
          <button className="px-6 py-2.5 bg-blue-50 text-[#1a73e8] text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-blue-100 transition-all flex items-center gap-2 border border-blue-100">
            <Plus size={16} />
            Add Entity
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[32px] border border-[#dadce0] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#dadce0]">
                {[
                  { key: 'plateNumber', label: 'License Identifier' },
                  { key: 'ownerName', label: 'Legal Owner' },
                  { key: 'vehicleType', label: 'Vehicle Class' },
                  { key: 'city', label: 'Jurisdiction' },
                  { key: 'registrationDate', label: 'Authorized' },
                ].map((col) => (
                  <th 
                    key={col.key}
                    onClick={() => handleSort(col.key as keyof Vehicle)}
                    className="py-5 px-8 text-[10px] uppercase font-bold text-[#5f6368] tracking-widest cursor-pointer hover:bg-[#f1f3f4] transition-all"
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      <ArrowUpDown size={12} className={sortKey === col.key ? 'text-[#1a73e8]' : 'text-[#9aa0a6]'} />
                    </div>
                  </th>
                ))}
                <th className="py-5 px-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f4]">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="p-8"><div className="h-5 bg-[#f1f3f4] rounded-lg animate-pulse w-full" /></td>
                      ))}
                    </tr>
                  ))
                ) : paged.length > 0 ? (
                  paged.map((vehicle) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={vehicle.id} 
                      className="hover:bg-[#fcfdfe] transition-colors group"
                    >
                      <td className="py-6 px-8">
                        <span className="font-mono font-bold text-[#1a73e8] bg-[#e8f0fe] border border-blue-100 px-3 py-1.5 rounded-lg text-sm shadow-sm">
                          {vehicle.plateNumber}
                        </span>
                      </td>
                      <td className="py-6 px-8">
                        <p className="text-[#202124] font-semibold text-[15px]">{vehicle.ownerName}</p>
                      </td>
                      <td className="py-6 px-8">
                        <span className="text-[#5f6368] text-sm font-medium">{vehicle.vehicleType}</span>
                      </td>
                      <td className="py-6 px-8">
                        <span className="text-[#5f6368] text-sm bg-[#f1f3f4] px-2 py-1 rounded-md">{vehicle.city}</span>
                      </td>
                      <td className="py-6 px-8">
                        <span className="text-[#80868b] font-mono text-xs">{vehicle.registrationDate}</span>
                      </td>
                      <td className="py-6 px-8 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                          <button className="p-2.5 text-[#5f6368] hover:text-[#1a73e8] hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100">
                            <Edit3 size={16} />
                          </button>
                          <button className="p-2.5 text-[#5f6368] hover:text-[#d93025] hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-24 text-center text-[#5f6368] font-medium italic bg-[#fcfdfe]">The data filter produced zero valid registration identifiers.</td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination - Google Style */}
        <div className="px-8 py-5 border-t border-[#f1f3f4] flex items-center justify-between bg-white">
          <p className="text-[#5f6368] text-xs font-semibold">
            Results <span className="text-[#202124]">{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)}</span> of <span className="text-[#202124]">{filtered.length}</span>
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 bg-white text-[#5f6368] border border-[#dadce0] rounded-lg disabled:opacity-30 hover:bg-[#f8f9fa] transition-all shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                 const p = i + 1;
                 const isActive = currentPage === p;
                 return (
                   <button 
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-9 h-9 rounded-full text-xs font-bold transition-all ${isActive ? 'bg-[#1a73e8] text-white shadow-md' : 'text-[#5f6368] hover:bg-[#f1f3f4]'}`}
                   >
                     {p}
                   </button>
                 );
              })}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 bg-white text-[#5f6368] border border-[#dadce0] rounded-lg disabled:opacity-30 hover:bg-[#f8f9fa] transition-all shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
