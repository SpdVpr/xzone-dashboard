'use client';

import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon?: ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  footer?: string;
}

export default function StatCard({ title, value, icon, change, footer }: StatCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          {icon && <div className="flex-shrink-0 mr-3">{icon}</div>}
          <div>
            <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
      {(change || footer) && (
        <div className="bg-gray-50 px-5 py-3">
          {change && (
            <div className="text-sm">
              <span
                className={`font-medium ${
                  change.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change.isPositive ? '+' : ''}
                {change.value}%
              </span>
              <span className="text-gray-500 ml-2">oproti minulému období</span>
            </div>
          )}
          {footer && <div className="text-sm text-gray-500">{footer}</div>}
        </div>
      )}
    </div>
  );
}
