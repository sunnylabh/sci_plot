import React, { useState, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  ReferenceArea
} from 'recharts';
import { Download, ZoomOut } from 'lucide-react';
import { DataPoint, PlotConfig } from '../types';

interface ChartProps {
  data: DataPoint[];
  config: PlotConfig;
  onConfigChange: (newConfig: PlotConfig) => void;
}

export const Chart: React.FC<ChartProps> = ({ data, config, onConfigChange }) => {
  const [refAreaLeft, setRefAreaLeft] = useState<number | string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<number | string | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const xDomain = [
    typeof config.xRange.min === 'number' ? config.xRange.min : 'auto',
    typeof config.xRange.max === 'number' ? config.xRange.max : 'auto'
  ];

  const yDomain = [
    typeof config.yRange.min === 'number' ? config.yRange.min : 'auto',
    typeof config.yRange.max === 'number' ? config.yRange.max : 'auto'
  ];

  const isZoomed = typeof config.xRange.min === 'number' || typeof config.xRange.max === 'number';

  const zoom = () => {
    if (refAreaLeft === refAreaRight || refAreaRight === null || refAreaLeft === null) {
      setRefAreaLeft(null);
      setRefAreaRight(null);
      return;
    }

    // Ensure left is smaller than right
    let min = refAreaLeft;
    let max = refAreaRight;

    if (typeof min === 'number' && typeof max === 'number') {
      if (min > max) [min, max] = [max, min];
    }

    onConfigChange({
      ...config,
      xRange: { min: Number(min), max: Number(max) }
    });

    setRefAreaLeft(null);
    setRefAreaRight(null);
  };

  const zoomOut = () => {
    onConfigChange({
      ...config,
      xRange: { min: '', max: '' },
      yRange: { min: '', max: '' }
    });
  };

  const handleDownload = () => {
    if (chartContainerRef.current) {
      // Find the SVG element inside the ResponsiveContainer
      const svgElement = chartContainerRef.current.querySelector('.recharts-surface');
      if (svgElement) {
        // Serialize SVG to string
        const svgData = new XMLSerializer().serializeToString(svgElement);
        
        // Create a canvas to draw the SVG
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        // Get dimensions
        const svgRect = svgElement.getBoundingClientRect();
        canvas.width = svgRect.width;
        canvas.height = svgRect.height;

        img.onload = () => {
          if (ctx) {
            // Fill white background (SVG is transparent by default)
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // Draw image
            ctx.drawImage(img, 0, 0);
            
            // Trigger download
            const a = document.createElement('a');
            a.download = `${config.title.replace(/\s+/g, '_')}_plot.png`;
            a.href = canvas.toDataURL('image/png');
            a.click();
          }
        };

        // Use encodeURIComponent to handle potential unicode characters in labels
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
      }
    }
  };

  return (
    <div 
      className="w-full h-full min-h-[400px] bg-white rounded-lg p-4 shadow-lg relative group" 
      ref={chartContainerRef}
    >
      {/* Toolbar */}
      <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {isZoomed && (
          <button
            onClick={zoomOut}
            className="p-2 bg-zinc-800 text-white rounded-md hover:bg-zinc-700 shadow-md flex items-center gap-1 text-xs font-bold"
            title="Reset Zoom"
          >
            <ZoomOut size={14} />
            RESET
          </button>
        )}
        <button
          onClick={handleDownload}
          className="p-2 bg-orange-600 text-white rounded-md hover:bg-orange-500 shadow-md flex items-center gap-1 text-xs font-bold"
          title="Download PNG"
        >
          <Download size={14} />
          SAVE
        </button>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          onMouseDown={(e) => e && e.activeLabel !== undefined && setRefAreaLeft(e.activeLabel)}
          onMouseMove={(e) => refAreaLeft && e && e.activeLabel !== undefined && setRefAreaRight(e.activeLabel)}
          onMouseUp={zoom}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="x" 
            type="number" 
            domain={xDomain as any} 
            allowDataOverflow
            stroke="#374151"
            tick={{fontSize: 12}}
          >
             <Label value={config.xLabel} offset={-20} position="insideBottom" style={{ fontWeight: 'bold', fill: '#1f2937' }} />
          </XAxis>
          <YAxis 
            type="number" 
            domain={yDomain as any} 
            allowDataOverflow
            stroke="#374151"
            tick={{fontSize: 12}}
          >
             <Label value={config.yLabel} angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontWeight: 'bold', fill: '#1f2937' }} />
          </YAxis>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', color: '#fff', border: 'none', borderRadius: '4px' }}
            itemStyle={{ color: '#fb923c' }}
            formatter={(value: number) => [value.toFixed(4), config.yLabel]}
            labelFormatter={(label: number) => `${config.xLabel}: ${label.toFixed(4)}`}
          />
          <Line 
            type="monotone" 
            dataKey="y" 
            stroke="#ea580c" /* Orange-600 */
            strokeWidth={2} 
            dot={data.length < 50 ? { r: 3, fill: '#ea580c' } : false} 
            activeDot={{ r: 6, fill: '#ef4444' }} /* Red-500 */
            isAnimationActive={false}
          />
          {refAreaLeft && refAreaRight ? (
            <ReferenceArea 
              x1={refAreaLeft} 
              x2={refAreaRight} 
              strokeOpacity={0.3} 
              fill="#ea580c" 
              fillOpacity={0.1} 
            />
          ) : null}
        </LineChart>
      </ResponsiveContainer>
      
      {/* Selection Hint */}
      {!isZoomed && data.length > 0 && (
        <div className="absolute bottom-2 right-4 text-[10px] text-zinc-400 pointer-events-none select-none">
          Click and drag to zoom
        </div>
      )}
    </div>
  );
};