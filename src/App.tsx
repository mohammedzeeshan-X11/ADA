/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Upload } from './pages/Upload';
import { Database } from './pages/Database';
import { About } from './pages/About';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home onStart={() => setActiveTab('upload')} />;
      case 'upload': return <Upload />;
      case 'database': return <Database />;
      case 'about': return <About />;
      default: return <Home onStart={() => setActiveTab('upload')} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex overflow-x-hidden">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-20 md:ml-64 p-4 md:p-8 relative min-h-screen">
        {/* Background Gradients - Softened for light theme */}
        <div className="fixed top-0 right-0 w-1/2 h-1/2 bg-blue-100/30 blur-[120px] pointer-events-none -z-10" />
        <div className="fixed bottom-0 left-0 w-1/2 h-1/2 bg-indigo-100/30 blur-[120px] pointer-events-none -z-10" />
        
        <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

