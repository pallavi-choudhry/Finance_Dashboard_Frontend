import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useMemo, useState } from 'react';

const TrendsChart = ({ trends, yearlyTrends = [] }) => {
  const [viewMode, setViewMode] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');

  const chartData = useMemo(() => {
    const sourceData = viewMode === 'yearly' ? yearlyTrends : trends;

    if (viewMode === 'yearly') {
      return sourceData;
    }

    return sourceData.filter((item) => {
      const yearMatch = selectedYear === 'all' || String(item.year) === String(selectedYear);
      const monthMatch = selectedMonth === 'all' || Number(item.month) === Number(selectedMonth);
      return yearMatch && monthMatch;
    });
  }, [viewMode, yearlyTrends, trends, selectedYear, selectedMonth]);

  const yearOptions = useMemo(() => {
    const years = [...new Set((trends || []).map((t) => t.year).filter(Boolean))];
    return years.sort((a, b) => b - a);
  }, [trends]);

  const monthOptions = [
    { value: 1, label: 'Jan' }, { value: 2, label: 'Feb' }, { value: 3, label: 'Mar' },
    { value: 4, label: 'Apr' }, { value: 5, label: 'May' }, { value: 6, label: 'Jun' },
    { value: 7, label: 'Jul' }, { value: 8, label: 'Aug' }, { value: 9, label: 'Sep' },
    { value: 10, label: 'Oct' }, { value: 11, label: 'Nov' }, { value: 12, label: 'Dec' }
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {viewMode === 'monthly' ? 'Monthly Trends' : 'Yearly Trends'}
        </h3>
        <div className="space-x-2">
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-3 py-1 text-sm rounded ${viewMode === 'monthly' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setViewMode('yearly')}
            className={`px-3 py-1 text-sm rounded ${viewMode === 'yearly' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Yearly
          </button>
        </div>
      </div>
      {viewMode === 'monthly' && (
        <div className="flex gap-2 mb-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-1 text-sm border rounded"
          >
            <option value="all">All Years</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-1 text-sm border rounded"
          >
            <option value="all">All Months</option>
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
        </div>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#10B981" name="Income" strokeWidth={2} />
          <Line type="monotone" dataKey="expense" stroke="#EF4444" name="Expense" strokeWidth={2} />
          <Line type="monotone" dataKey="net" stroke="#3B82F6" name="Net" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendsChart;