"use client";

import { useEffect, useState } from 'react';
import { ApexOptions } from 'apexcharts';

interface ApexChartWrapperProps {
  options: ApexOptions;
  series: any;
  type: "line" | "area" | "bar" | "histogram" | "pie" | "donut" | "radialBar" | "scatter" | "bubble" | "heatmap" | "candlestick" | "boxPlot" | "radar" | "polarArea" | "rangeBar" | "rangeArea" | "treemap";
  height: number;
  width?: string | number;
}

export const ApexChartWrapper = ({ 
  options, 
  series, 
  type, 
  height,
  width = '100%' 
}: ApexChartWrapperProps) => {
  const [mounted, setMounted] = useState(false);
  const [ChartComponent, setChartComponent] = useState<any>(null);

  // Only render the chart on the client side and dynamically import the library
  useEffect(() => {
    setMounted(true);
    
    // Dynamically import ApexCharts on the client side only
    import('react-apexcharts').then((mod) => {
      setChartComponent(() => mod.default);
    });
  }, []);

  if (!mounted || !ChartComponent) {
    return (
      <div 
        style={{ height: `${height}px`, width }} 
        className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded"
      />
    );
  }

  // Now we can safely render the chart
  return (
    <ChartComponent 
      options={options} 
      series={series} 
      type={type} 
      height={height}
      width={width}
    />
  );
}; 