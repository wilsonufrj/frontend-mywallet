// src/components/BarChart.tsx
import React from "react";
import { Chart } from "primereact/chart";

interface BarChartProps {
  data: any;
  options: any;
}

const BarChart: React.FC<BarChartProps> = ({ data, options }) => {
  return (
    <Chart
      type="bar"
      data={data}
      options={options}
      className="w-full h-full"
    />
  );
};

export default BarChart;
