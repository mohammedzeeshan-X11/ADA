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
  Database as DbIcon,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Vehicle } from '../lib/algorithms';
import { motion, AnimatePresence } from 'motion/react';

export const Database: React.FC = () => {
  const [records, setRecords] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<keyof Vehicle | ''>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modern Dialog states for adding / editing entities
  const [isOpen, setIsOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [ownerName, setOwnerName] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('Sedan');
  const [city, setCity] = useState('');
  const [registrationDate, setRegistrationDate] = useState(new Date().toISOString().split('T')[0]);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const openAddModal = () => {
    setEditingVehicle(null);
    setOwnerName('');
    setPlateNumber('');
    setVehicleType('Sedan');
    setCity('');
    setRegistrationDate(new Date().toISOString().split('T')[0]);
    setIsOpen(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setOwnerName(vehicle.ownerName);
    setPlateNumber(vehicle.plateNumber);
    setVehicleType(vehicle.vehicleType);
    setCity(vehicle.city);
    setRegistrationDate(vehicle.registrationDate);
    setIsOpen(true);
  };

  const handleDelete = async (id: string, plate: string) => {
    try {
      const res = await fetch(`/api/database/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRecords(prev => prev.filter(v => v.id !== id));
        showToast(`Successfully deleted vehicle registry for ${plate}!`);
      } else {
        showToast("Failed to unregister vehicle.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network operation error.", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName.trim() || !plateNumber.trim()) {
      showToast("Please supply legal owner name and license plate key.", "error");
      return;
    }

    setActionLoading(true);
    const body = { 
      ownerName: ownerName.trim(), 
      plateNumber: plateNumber.trim().toUpperCase(), 
      vehicleType, 
      city: city.trim() || "System Default", 
      registrationDate 
    };

    try {
      if (editingVehicle) {
        const res = await fetch(`/api/database/${editingVehicle.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (res.ok) {
          const updated = await res.json();
          setRecords(prev => prev.map(v => v.id === editingVehicle.id ? updated : v));
          showToast(`Successfully updated vehicle registry records for ${body.plateNumber}!`);
          setIsOpen(false);
        } else {
          showToast("Failed to update registration record.", "error");
        }
      } else {
        const res = await fetch('/api/database', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (res.ok) {
          const created = await res.json();
          setRecords(prev => [created, ...prev]);
          showToast(`Registered license identity ${body.plateNumber} to network databases.`);
          setIsOpen(false);
        } else {
          showToast("Failed to write new registry node.", "error");
        }
      }
    } catch (err) {
      console.error(err);
      showToast("Network response failed.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    // Fetch live system database records
    fetch('/api/database')
      .then(res => res.json())
      .then((data: Vehicle[]) => {
        setRecords(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch database:", err);
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

  const baseFiltered = records.filter(r => 
    r.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filtered = sortKey 
    ? [...baseFiltered].sort((a, b) => {
        const v1 = a[sortKey];
        const v2 = b[sortKey];
        if (sortOrder === 'asc') return v1 < v2 ? -1 : 1;
        return v1 > v2 ? -1 : 1;
      })
    : baseFiltered;

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
          <button 
            onClick={openAddModal}
            className="px-6 py-2.5 bg-[#1a73e8] text-white text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-blue-750 transition-all flex items-center gap-2 shadow-sm focus:outline-none"
          >
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
                          <button 
                            onClick={() => openEditModal(vehicle)}
                            title="Edit Record"
                            className="p-2.5 text-[#5f6368] hover:text-[#1a73e8] hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(vehicle.id, vehicle.plateNumber)}
                            title="Delete Record"
                            className="p-2.5 text-[#5f6368] hover:text-[#d93025] hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                          >
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

      {/* Floating System Notification Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold ${
              toast.type === "success" 
                ? "bg-[#e6f4ea] text-[#137333] border-[#ceead6]" 
                : "bg-[#fce8e6] text-[#c5221f] border-[#fad2cf]"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Add / Edit Entity Modal Box */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Ambient Backdrop Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            {/* Modal Body Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl border border-[#dadce0] overflow-hidden z-10"
            >
              <div className="bg-[#f8f9fa] border-b border-[#dadce0] px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-[#1a73e8] rounded-full flex items-center justify-center">
                    <DbIcon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#202124]">
                      {editingVehicle ? "Modify Registration" : "New License Registration"}
                    </h3>
                    <p className="text-xs text-[#5f6368]">
                      {editingVehicle ? "Update legal entity descriptors" : "Insert verified record into system"}
                    </p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5f6368]">
                    License Plate Identifier <span className="text-[#d93025]">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. DL-3CA-1234 or ABC-1034"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 bg-white border border-[#dadce0] rounded-xl text-[#202124] font-mono font-bold text-sm focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] outline-none transition-all placeholder:text-[#9aa0a6]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5f6368]">
                    Legal Owner Full Name <span className="text-[#d93025]">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[#dadce0] rounded-xl text-sm font-semibold text-[#202124] focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] outline-none transition-all placeholder:text-[#9aa0a6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5f6368]">
                      Vehicle Class
                    </label>
                    <select 
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-[#dadce0] rounded-xl text-sm font-semibold text-[#202124] focus:border-[#1a73e8] outline-none transition-all"
                    >
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Truck">Truck</option>
                      <option value="Motorcycle">Motorcycle</option>
                      <option value="Electric Vehicle">Electric Vehicle</option>
                      <option value="Premium Sedan">Premium Sedan</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5f6368]">
                      Jurisdiction / City
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-[#dadce0] rounded-xl text-sm font-semibold text-[#202124] focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] outline-none transition-all placeholder:text-[#9aa0a6]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5f6368]">
                    Authorization Registry Date
                  </label>
                  <input 
                    type="date"
                    value={registrationDate}
                    onChange={(e) => setRegistrationDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[#dadce0] rounded-xl text-sm font-mono font-semibold text-[#202124] focus:border-[#1a73e8] outline-none transition-all"
                  />
                </div>

                <div className="pt-4 border-t border-[#f1f3f4] flex gap-3 justify-end">
                  <button 
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-5 py-2.5 bg-white border border-[#dadce0] hover:bg-[#f8f9fa] text-[#5f6368] text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={actionLoading}
                    className="px-6 py-2.5 bg-[#1a73e8] hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-md shadow-blue-500/10 disabled:opacity-55"
                  >
                    {actionLoading ? "Saving..." : editingVehicle ? "Save" : "Register"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
