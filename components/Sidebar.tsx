import React from 'react';
import { PlotConfig } from '../types';
import { downloadProject } from '../utils/downloadUtils';
import { DownloadCloud } from 'lucide-react';

interface SidebarProps {
  config: PlotConfig;
  onConfigChange: (newConfig: PlotConfig) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPlot: () => void;
  hasData: boolean;
  canPlot: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  config,
  onConfigChange,
  onFileUpload,
  onPlot,
  canPlot
}) => {
  const handleChange = (field: keyof PlotConfig, value: any) => {
    onConfigChange({ ...config, [field]: value });
  };

  const handleRangeChange = (axis: 'xRange' | 'yRange', bound: 'min' | 'max', value: string) => {
    const numVal = value === '' ? '' : parseFloat(value);
    onConfigChange({
      ...config,
      [axis]: {
        ...config[axis],
        [bound]: numVal
      }
    });
  };

  return (
    <aside className="w-full md:w-80 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col gap-6 h-full overflow-y-auto">
      <div>
        <h2 className="text-xl font-bold text-orange-500 mb-4 tracking-wider">CONTROLS</h2>
        
        {/* Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-400 mb-2">Upload Data (.csv, .txt)</label>
          <input
            type="file"
            accept=".csv,.txt"
            onChange={onFileUpload}
            className="block w-full text-sm text-zinc-300
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-orange-600 file:text-white
              hover:file:bg-orange-700
              cursor-pointer"
          />
          <p className="text-xs text-zinc-500 mt-2 mb-3">Format: Two columns (X Y) separated by comma, tab, or space.</p>
          
          <button
            onClick={onPlot}
            disabled={!canPlot}
            className={`w-full py-2 rounded-md font-bold text-sm transition-all border
              ${!canPlot 
                ? 'bg-zinc-800 text-zinc-600 border-zinc-800 cursor-not-allowed' 
                : 'bg-zinc-800 text-orange-500 border-orange-500 hover:bg-orange-950 hover:text-orange-400'
              }`}
          >
            PLOT DATA
          </button>
        </div>

        {/* Labels */}
        <div className="space-y-4 mb-6 border-t border-zinc-800 pt-4">
          <h3 className="text-sm font-semibold text-white uppercase">Labels</h3>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Chart Title</label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-sm text-white focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">X Label</label>
              <input
                type="text"
                value={config.xLabel}
                onChange={(e) => handleChange('xLabel', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-sm text-white focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Y Label</label>
              <input
                type="text"
                value={config.yLabel}
                onChange={(e) => handleChange('yLabel', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-sm text-white focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Range Controls */}
        <div className="space-y-4 mb-6 border-t border-zinc-800 pt-4">
          <h3 className="text-sm font-semibold text-white uppercase">Axis Ranges</h3>
          
          <div className="space-y-2">
            <label className="block text-xs text-orange-400">X-Axis Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={config.xRange.min}
                onChange={(e) => handleRangeChange('xRange', 'min', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-sm text-white focus:border-orange-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Max"
                value={config.xRange.max}
                onChange={(e) => handleRangeChange('xRange', 'max', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-sm text-white focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs text-orange-400">Y-Axis Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={config.yRange.min}
                onChange={(e) => handleRangeChange('yRange', 'min', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-sm text-white focus:border-orange-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Max"
                value={config.yRange.max}
                onChange={(e) => handleRangeChange('yRange', 'max', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-sm text-white focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
        
        {/* Download Project Button */}
        <div className="border-t border-zinc-800 pt-6 mt-auto">
          <button 
             onClick={downloadProject}
             className="flex items-center justify-center gap-2 w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded transition-colors"
          >
            <DownloadCloud size={14} />
            Download Source Code
          </button>
        </div>
      </div>
    </aside>
  );
};