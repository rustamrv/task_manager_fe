import { useDeleteTaskMutation } from '@api/endpoints/TaskApi';
import { Button } from '@components/ui/Button';
import ModalComponent from '@components/ui/ModalComponent';

interface DeleteTaskFormProps {
  id: string;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (open: boolean) => void;
  refetch: () => void;
}

const DeleteTaskForm: React.FC<DeleteTaskFormProps> = ({
  id,
  refetch,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
}) => {
  const [deleteTaskMutation] = useDeleteTaskMutation();

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTaskMutation(id).unwrap();
      refetch();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <ModalComponent
      isOpen={isDeleteModalOpen}
      onOpenChange={setIsDeleteModalOpen}
      title="Delete Task"
      description="Are you sure you want to delete this task?"
    >
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={() => handleDeleteTask(id)}>
          Delete
        </Button>
      </div>
    </ModalComponent>
  );
};

export default DeleteTaskForm;
