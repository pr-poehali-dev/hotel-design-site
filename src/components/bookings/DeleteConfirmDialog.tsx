import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DeleteConfirmDialogProps {
  bookingId: string | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

const DeleteConfirmDialog = ({ bookingId, onClose, onConfirm }: DeleteConfirmDialogProps) => {
  return (
    <Dialog open={!!bookingId} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Удалить бронирование?</DialogTitle>
          <DialogDescription>
            Это действие нельзя отменить. Бронирование будет удалено безвозвратно.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => bookingId && onConfirm(bookingId)}
          >
            Удалить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
