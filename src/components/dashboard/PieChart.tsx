'use client';

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { formatCurrency, formatPercentage } from '@/lib/utils/format';

interface DataPoint {
  name: string;
  value: number;
  [key: string]: string | number | boolean | null | undefined;
}

interface PieChartProps {
  data: DataPoint[];
  title: string;
  colors?: string[];
  isCurrency?: boolean;
  showPercentage?: boolean;
  height?: number;
}

const DEFAULT_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#6366f1', '#8b5cf6'];

export default function PieChart({
  data,
  title,
  colors = DEFAULT_COLORS,
  isCurrency = false,
  showPercentage = true,
  height = 300
}: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const percentage = (item.value as number) / total;
      
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded">
          <p className="font-medium text-gray-900">{item.name}</p>
          <p className="text-sm text-gray-700">
            {isCurrency ? formatCurrency(item.value as number) : item.value}
          </p>
          {showPercentage && (
            <p className="text-sm text-gray-700">
              {formatPercentage(percentage)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  interface LabelProps {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: LabelProps) => {
    if (!showPercentage) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
