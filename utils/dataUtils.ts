import { DataPoint, DataStats } from '../types';

export const parseFileContent = (content: string): DataPoint[] => {
  const lines = content.trim().split('\n');
  const data: DataPoint[] = [];

  for (const line of lines) {
    // Try to split by comma, tab, or multiple spaces
    const parts = line.trim().split(/[, \t]+/);
    
    // We expect at least two columns
    if (parts.length >= 2) {
      const x = parseFloat(parts[0]);
      const y = parseFloat(parts[1]);

      if (!isNaN(x) && !isNaN(y)) {
        data.push({ x, y });
      }
    }
  }
  return data;
};

export const calculateStats = (data: DataPoint[]): DataStats => {
  if (data.length === 0) {
    return { count: 0, minX: 0, maxX: 0, minY: 0, maxY: 0, meanY: 0, stdY: 0 };
  }

  const xValues = data.map(d => d.x);
  const yValues = data.map(d => d.y);

  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  const sumY = yValues.reduce((a, b) => a + b, 0);
  const meanY = sumY / data.length;
  
  const squareDiffs = yValues.map(value => Math.pow(value - meanY, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / data.length;
  const stdY = Math.sqrt(avgSquareDiff);

  return {
    count: data.length,
    minX,
    maxX,
    minY,
    maxY,
    meanY,
    stdY
  };
};

export const downsampleData = (data: DataPoint[], maxPoints: number = 50): DataPoint[] => {
  if (data.length <= maxPoints) return data;
  const step = Math.ceil(data.length / maxPoints);
  return data.filter((_, index) => index % step === 0);
};