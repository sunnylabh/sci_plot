export interface DataPoint {
  x: number;
  y: number;
}

export interface Dataset {
  name: string;
  data: DataPoint[];
  xLabel: string;
  yLabel: string;
}

export interface AxisRange {
  min: number | '';
  max: number | '';
}

export interface PlotConfig {
  xRange: AxisRange;
  yRange: AxisRange;
  title: string;
  xLabel: string;
  yLabel: string;
}

export interface DataStats {
  count: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  meanY: number;
  stdY: number;
}