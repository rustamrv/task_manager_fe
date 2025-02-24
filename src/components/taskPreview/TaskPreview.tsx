import React from 'react';
import { Task } from '@api/types/TaskTypes';
import { formatDateToLocal } from '@utils/date/FormDate';
import parse from 'html-react-parser';

interface TaskPreviewProps {
  task: Task;
}

const TaskPreview: React.FC<TaskPreviewProps> = ({ task }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm flex flex-col gap-2 transition-all opacity-80">
      <h3 className="text-sm text-gray-500">{task.title}</h3>
      {task.description && (
        <p className="text-sm text-gray-500">{parse(task.description)}</p>
      )}
      {task.dueDate && (
        <p className="text-sm text-gray-500">
          Due: {formatDateToLocal(task.dueDate)}
        </p>
      )}
      {task.assignee?.username && (
        <p className="text-sm text-gray-500">
          Assigned to: {task.assignee.username}
        </p>
      )}
    </div>
  );
};

export default TaskPreview;
