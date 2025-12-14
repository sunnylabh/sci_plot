import React, { useState, useMemo } from 'react';
import { Chart } from './components/Chart';
import { Sidebar } from './components/Sidebar';
import { DataPoint, PlotConfig, DataStats } from './types';
import { parseFileContent, calculateStats } from './utils/dataUtils';
import { Activity, Microscope, Terminal } from 'lucide-react';

const INITIAL_CONFIG: PlotConfig = {
  title: 'Data Visualization',
  xLabel: 'X-Axis',
  yLabel: 'Y-Axis',
  xRange: { min: '', max: '' },
  yRange: { min: '', max: '' }
};

const App: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [pendingData, setPendingData] = useState<DataPoint[]>([]);
  const [config, setConfig] = useState<PlotConfig>(INITIAL_CONFIG);
  const [error, setError] = useState<string | null>(null);

  // Calculate stats whenever data changes
  const stats: DataStats = useMemo(() => calculateStats(data), [data]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const parsedData = parseFileContent(content);
        if (parsedData.length === 0) {
          setError("No valid data points found. Ensure file is CSV or space/tab separated.");
          setPendingData([]);
          return;
        }
        setPendingData(parsedData);
        setError(null);
      } catch (err) {
        setError("Error parsing file. Please check the format.");
        setPendingData([]);
      }
    };
    reader.readAsText(file);
  };

  const handlePlot = () => {
    if (pendingData.length === 0) return;
    
    setData(pendingData);
    setConfig((prev: PlotConfig) => ({
      ...prev,
      xRange: { min: '', max: '' },
      yRange: { min: '', max: '' }
    }));
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-black text-white overflow-hidden font-sans">
      
      {/* Sidebar Controls */}
      <Sidebar 
        config={config} 
        onConfigChange={setConfig} 
        onFileUpload={handleFileUpload}
        onPlot={handlePlot}
        hasData={data.length > 0}
        canPlot={pendingData.length > 0}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto bg-black">
        
        {/* Header */}
        <header className="px-8 py-6 border-b border-zinc-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600 rounded-lg">
              <Microscope size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">SciPlot</h1>
              <p className="text-xs text-zinc-500">Scientific Analysis & Visualization</p>
            </div>
          </div>
          
          {data.length > 0 && (
            <div className="flex gap-6 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-orange-500" />
                <span>Points: <span className="text-white font-mono">{stats.count}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-orange-500" />
                <span>Mean Y: <span className="text-white font-mono">{stats.meanY.toFixed(3)}</span></span>
              </div>
            </div>
          )}
        </header>

        {/* Content Area */}
        <div className="p-8 flex-1 flex flex-col gap-8 max-w-7xl mx-auto w-full">
          
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Plot Section */}
          <section className="flex flex-col gap-4 flex-1 min-h-[500px]">
            <div className="flex justify-between items-end">
               <h2 className="text-xl font-semibold text-zinc-200">{config.title}</h2>
               {/* Legend-ish Info */}
               {data.length > 0 && (
                 <div className="text-xs text-zinc-500 flex gap-4">
                   <span>X: <span className="text-zinc-300">{config.xLabel}</span></span>
                   <span>Y: <span className="text-zinc-300">{config.yLabel}</span></span>
                 </div>
               )}
            </div>
            
            <div className="flex-1 border border-zinc-800 rounded-xl p-1 bg-zinc-900 shadow-2xl overflow-hidden relative">
              {data.length > 0 ? (
                <Chart data={data} config={config} onConfigChange={setConfig} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 gap-4">
                  <Activity size={48} className="opacity-20" />
                  <p>Upload a .txt or .csv file, then click "PLOT DATA"</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;