import React, { useEffect, useState } from 'react';
import TaskColumn from '../taskColumn/TaskColumn';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  useGetAllTasksQuery,
  useAddTaskMutation,
  useGetAllUsersQuery,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from '../../api/apiSlice';
import DynamicForm from '../form/DynamicForm';
import { Task } from '../../interfaces';

const TasksHome: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: columnsInit,
    isLoading,
    isError,
    refetch,
  } = useGetAllTasksQuery();
  const { data: usersInit } = useGetAllUsersQuery();
  const [addTaskMutation] = useAddTaskMutation();
  const [deleteTaskMutation] = useDeleteTaskMutation();
  const [updateTaskMutation] = useUpdateTaskMutation();

  const [columns, setColumns] = useState(columnsInit || []);
  const [status, setStatus] = useState(['to-do', 'in-progress', 'done']);
  const [users, setUsers] = useState(usersInit || []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (columnsInit) {
      setColumns(columnsInit);
    }
  }, [columnsInit]);

  useEffect(() => {
    if (usersInit) {
      setUsers(usersInit);
    }
  }, usersInit);

  const handleAddTask = async (newTask: any) => {
    try {
      await addTaskMutation(newTask).unwrap();
      await refetch();

      setIsDialogOpen(false);
    } catch (error: any) {
      const backendErrors = error?.data?.errors || [];
      const errorMessage = backendErrors.map((err: any) => err.msg).join(', ');
      setError(errorMessage || 'Failed to add a task. Try again.');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTaskMutation(id);
      refetch();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleDropTask = async (task: Task, targetColumn: string) => {
    try {
      let updateStatus = 'to-do';
      switch (targetColumn) {
        case 'To do':
          updateStatus = 'to-do';
          break;
        case 'In progress':
          updateStatus = 'in-progress';
          break;
        case 'Done':
          updateStatus = 'done';
          break;
      }

      await updateTaskMutation({
        id: task.id,
        task: {
          status: updateStatus,
        },
      }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to move task:', error);
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await updateTaskMutation({ id: updatedTask.id, task: updatedTask });
      refetch();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  if (isLoading) return <p>Loading tasks...</p>;
  if (isError) return <p>Error loading tasks.</p>;

  return (
    <section className="flex flex-col flex-grow h-full overflow-hidden">
      <div className="flex justify-between items-center border-b border-gray-300 pb-4 mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 text-white hover:bg-blue-600">
              + Add New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new task.
              </DialogDescription>
            </DialogHeader>
            <DynamicForm
              fields={
                [
                  {
                    name: 'title',
                    label: 'Title',
                    type: 'text',
                    placeholder: 'Task Title',
                    required: true,
                  },
                  {
                    name: 'description',
                    label: 'Description',
                    type: 'text',
                    placeholder: 'Task Description',
                    required: true,
                  },
                  {
                    name: 'dueDate',
                    label: 'Due Date',
                    type: 'date',
                    placeholder: 'Select a deadline',
                    required: true,
                  },
                  {
                    name: 'status',
                    label: 'Status',
                    type: 'select',
                    options: status.map((col) => col),
                    placeholder: 'Select a status',
                    required: true,
                  },
                  {
                    name: 'assignee',
                    label: 'Assignee',
                    type: 'select',
                    options: users.map((user) => ({
                      label: user.username,
                      value: user._id,
                    })),
                    placeholder: 'Select a user',
                  },
                ] as any
              }
              onSubmit={handleAddTask}
              onCancel={() => setIsDialogOpen(false)}
              submitLabel="Add Task"
              error={error}
            />
          </DialogContent>
        </Dialog>
      </div>
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-grow gap-4 overflow-y-auto">
          {columns.map((column, colIndex) => (
            <TaskColumn
              key={colIndex}
              title={column.title}
              tasks={column.tasks}
              onUpdateTask={(updatedTask) => handleUpdateTask(updatedTask)}
              onDeleteTask={(id: string) => handleDeleteTask(id)}
              onDropTask={(draggedTask) =>
                handleDropTask(draggedTask, column.title)
              }
            />
          ))}
        </div>
      </DndProvider>
    </section>
  );
};

export default TasksHome;
