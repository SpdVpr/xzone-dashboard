'use client';

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { formatCurrency } from '@/lib/utils/format';
import { formatDate } from '@/lib/utils/date';

interface DataPoint {
  date: string;
  value: number;
  [key: string]: any;
}

interface LineChartProps {
  data: DataPoint[];
  title: string;
  dataKey: string;
  xAxisDataKey?: string;
  color?: string;
  isCurrency?: boolean;
  height?: number;
  formatXAxis?: boolean;
}

export default function LineChart({
  data,
  title,
  dataKey,
  xAxisDataKey = 'date',
  color = '#3b82f6',
  isCurrency = false,
  height = 300,
  formatXAxis = true
}: LineChartProps) {
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded">
          <p className="font-medium text-gray-900">
            {formatXAxis ? formatDate(label) : label}
          </p>
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
          <RechartsLineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={xAxisDataKey} 
              tickFormatter={formatXAxis ? (value) => formatDate(value) : undefined}
            />
            <YAxis
              tickFormatter={(value) => (isCurrency ? formatCurrency(value) : value.toString())}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              activeDot={{ r: 8 }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
