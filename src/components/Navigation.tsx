import React from 'react';
import { 
  Car, 
  Database, 
  Upload as UploadIcon, 
  Info
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const items = [
    { id: 'home', label: 'Home', icon: Car },
    { id: 'upload', label: 'LPR Scan', icon: UploadIcon },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'about', label: 'About Project', icon: Info },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-20 md:w-64 bg-white border-r border-[#dadce0] py-6 flex flex-col z-50">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-9 h-9 bg-[#1a73e8] rounded-xl flex items-center justify-center shadow-sm">
          <Car className="text-white" size={20} />
        </div>
        <span className="hidden md:block font-medium text-lg text-[#3c4043] tracking-tight">LPR System</span>
      </div>
      
      <div className="flex-1 px-3 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-200
                ${isActive 
                  ? 'bg-[#e8f0fe] text-[#1967d2] font-semibold' 
                  : 'text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#202124]'
                }
              `}
            >
              <Icon size={18} />
              <span className="hidden md:block text-sm">{item.label}</span>
            </button>
          );
        })}
      </div>
      
      <div className="px-6 pt-6 border-t border-[#f1f3f4]">
        <div className="flex items-center gap-3 bg-[#f8f9fa] p-3 rounded-2xl border border-[#dadce0]">
          <div className="w-8 h-8 rounded-full bg-[#1a73e8] flex items-center justify-center shadow-sm">
            <span className="text-[10px] font-bold text-white">LPR</span>
          </div>
          <div className="hidden md:block">
            <p className="text-[11px] font-bold text-[#3c4043]">LPR Core Suite</p>
            <p className="text-[9px] text-[#5f6368] uppercase font-bold tracking-tight">v1.2 Stable</p>
          </div>
        </div>
      </div>
    </nav>
  );
};
