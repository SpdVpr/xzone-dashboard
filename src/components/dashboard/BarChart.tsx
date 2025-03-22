'use client';

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { formatCurrency } from '@/lib/utils/format';

interface BarChartProps {
  data: Array<Record<string, string | number>>;
  title: string;
  dataKey: string;
  xAxisDataKey?: string;
  color?: string;
  isCurrency?: boolean;
  height?: number;
  showXAxis?: boolean;
  showYAxis?: boolean;
}

export default function BarChart({
  data,
  title,
  dataKey,
  xAxisDataKey = 'name',
  color = '#3b82f6',
  isCurrency = false,
  height = 300,
  showXAxis = true,
  showYAxis = true
}: BarChartProps) {
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-700">
            {isCurrency
              ? formatCurrency(payload[0].value as number)
              : payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <RechartsBarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {showXAxis && <XAxis dataKey={xAxisDataKey} />}
            {showYAxis && (
              <YAxis
                tickFormatter={(value) => (isCurrency ? formatCurrency(value) : value.toString())}
              />
            )}
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey={dataKey} fill={color} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
