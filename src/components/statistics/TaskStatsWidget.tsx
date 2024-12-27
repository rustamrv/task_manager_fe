import React from 'react';
import { useGetTaskStatsQuery } from '../../api/apiSlice';

const TaskStatsWidget: React.FC = () => {
  const { data, error, isLoading } = useGetTaskStatsQuery({});

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading stats</div>;

  const { totalTasks, completedTasks } = data;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Tasks Completed</h2>
      <p className="text-gray-700">{completedTasks}/{totalTasks} tasks completed</p>
    </div>
  );
};

export default TaskStatsWidget;
