import React, { useEffect, useMemo } from 'react';
import { useGetTaskCompletionStatsQuery } from '../../api/endpoints/TaskApi';
import {
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  Line,
  LineChart,
} from 'recharts';
import { processTaskCompletionData } from '@utils/statistics/statistics';

const TaskCompletionReport: React.FC = () => {
  const { data, error, isLoading, refetch } = useGetTaskCompletionStatsQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const chartData = useMemo(() => {
    return data ? processTaskCompletionData(data) : [];
  }, [data]);

  if (isLoading || !data) return <div>Loading detailed report...</div>;
  if (error) return <div>Error loading detailed report</div>;

  return (
    <section className="flex-1 p-6 mx-auto max-w-7xl w-full">
      <div className="p-4 bg-white rounded-lg shadow-lg border-t-4 border-green-500 mb-6 w-full">
        <h2 className="text-2xl font-bold mb-4 text-green-700">
          Task Completion Over Time
        </h2>
        <div className="h-[500px] w-full min-w-[600px]">
          <ResponsiveContainer width="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Area
                type="monotone"
                dataKey="to do"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
                name="To Do"
              />
              <Area
                type="monotone"
                dataKey="done"
                stackId="1"
                stroke="#82ca9d"
                fill="#82ca9d"
                name="Done"
              />
              <Area
                type="monotone"
                dataKey="in-progress"
                stackId="1"
                stroke="#ffc658"
                fill="#ffc658"
                name="In Progress"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg shadow-lg border-t-4 border-blue-500 w-full">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">
          Task Status Changes
        </h2>
        <div className="h-[300px] w-full min-w-[600px]">
          <ResponsiveContainer width="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="to do" stroke="#8884d8" />
              <Line type="monotone" dataKey="in-progress" stroke="#82ca9d" />
              <Line type="monotone" dataKey="done" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default TaskCompletionReport;
