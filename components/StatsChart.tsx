import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface StatsChartProps {
  countryName: string;
  baseGdp: number; // Billions
}

const StatsChart: React.FC<StatsChartProps> = ({ countryName, baseGdp }) => {
  
  // Mock historical data generation based on base GDP to make the chart look realistic
  const data = useMemo(() => {
    const currentYear = 2024;
    const history = [];
    let current = baseGdp * 0.8; // Start 5 years ago at 80%

    for (let i = 5; i >= 0; i--) {
      history.push({
        year: currentYear - i,
        gdp: Math.round(current),
      });
      // Random growth between 1% and 6%
      current = current * (1 + (Math.random() * 0.05 + 0.01));
    }
    return history;
  }, [baseGdp]);

  return (
    <div className="w-full h-48 mt-4 bg-white/5 rounded-lg p-2 border border-white/10">
      <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">5-Year Trend (Est.)</h4>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorGdp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
          <XAxis 
            dataKey="year" 
            tick={{fill: '#9ca3af', fontSize: 10}} 
            axisLine={false} 
            tickLine={false}
          />
          <YAxis 
            hide 
            domain={['dataMin', 'dataMax']} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6', fontSize: '12px' }}
            formatter={(value: number) => [`$${value}B`, 'GDP']}
            labelStyle={{ color: '#9ca3af' }}
          />
          <Area 
            type="monotone" 
            dataKey="gdp" 
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorGdp)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;