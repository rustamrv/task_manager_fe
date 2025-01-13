import React, { useEffect } from 'react';
import { useGetTaskCompletionStatsQuery } from '../../api/endpoints/TaskApi';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { processTaskCompletionData } from '@utils/statistics/statistics';

const TaskReport: React.FC = () => {
  const {
    data: completionData,
    error: completionError,
    isLoading: isLoadingCompletion,
    refetch: refetchCompletion,
  } = useGetTaskCompletionStatsQuery();

  useEffect(() => {
    refetchCompletion();
  }, [refetchCompletion]);

  if (isLoadingCompletion || !completionData)
    return <div>Loading detailed report...</div>;

  if (completionError) return <div>Error loading detailed report</div>;

  const chartData = processTaskCompletionData(completionData);

  return (
    <section className="p-6 bg-gray-50 rounded-lg shadow-md">
      {/* График выполнения задач */}
      <div className="p-6 bg-white rounded-lg shadow-lg border-t-4 border-green-500 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-green-700">
          Task Completion Over Time
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="To do" fill="#8884d8" />
            <Bar dataKey="in-progress" fill="#82ca9d" />
            <Bar dataKey="done" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* График выполнения задач по дням */}
      <div className="p-6 bg-white rounded-lg shadow-lg border-t-4 border-blue-500">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">
          Task Status Changes
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="To do" stroke="#8884d8" />
            <Line type="monotone" dataKey="in-progress" stroke="#82ca9d" />
            <Line type="monotone" dataKey="done" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default TaskReport;
