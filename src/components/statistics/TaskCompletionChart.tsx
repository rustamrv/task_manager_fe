import React, { useEffect } from 'react';
import { useGetTaskCompletionStatsQuery } from '../../api/endpoints/TaskApi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const TaskCompletionChart: React.FC = () => {
  const { data, error, isLoading, refetch } = useGetTaskCompletionStatsQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);


  if (isLoading)
    return (
      <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center">
        <div className="loader animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-6 bg-red-100 rounded-lg shadow-md text-center">
        <p className="text-red-500">Error loading chart</p>
      </div>
    );

    if (!data) return <div>No data available</div>

  const chartData = data.reduce(
    (acc: { [x: number]: any; date: any }[], { _id, count }: any) => {
      const { date, status } = _id;
      const found = acc.find((item: { date: any }) => item.date === date);
      if (found) {
        found[status] = count;
      } else {
        acc.push({ date, [status]: count });
      }
      return acc;
    },
    []
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border-t-4 border-green-500">
      <h2 className="text-2xl font-bold mb-4 text-green-700">
        Task Completion Over Time
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="to-do" stroke="#8884d8" />
          <Line type="monotone" dataKey="in-progress" stroke="#82ca9d" />
          <Line type="monotone" dataKey="done" stroke="#ffc658" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskCompletionChart;
