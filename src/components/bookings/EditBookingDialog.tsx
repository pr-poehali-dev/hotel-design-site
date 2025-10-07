import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Booking } from './types';

interface EditBookingDialogProps {
  booking: Booking | null;
  onClose: () => void;
  onSave: () => void;
  onChange: (booking: Booking) => void;
}

const EditBookingDialog = ({ booking, onClose, onSave, onChange }: EditBookingDialogProps) => {
  return (
    <Dialog open={!!booking} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Редактировать бронирование</DialogTitle>
          <DialogDescription>
            Измените данные бронирования и нажмите "Сохранить"
          </DialogDescription>
        </DialogHeader>
        {booking && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guest_name">Имя гостя</Label>
                <Input
                  id="guest_name"
                  value={booking.guest_name}
                  onChange={(e) => onChange({...booking, guest_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apartment_id">Номер апартамента</Label>
                <Input
                  id="apartment_id"
                  value={booking.apartment_id}
                  onChange={(e) => onChange({...booking, apartment_id: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="check_in">Дата заезда</Label>
                <Input
                  id="check_in"
                  type="date"
                  value={booking.check_in}
                  onChange={(e) => onChange({...booking, check_in: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="check_out">Дата выезда</Label>
                <Input
                  id="check_out"
                  type="date"
                  value={booking.check_out}
                  onChange={(e) => onChange({...booking, check_out: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="guest_email">Email гостя</Label>
              <Input
                id="guest_email"
                type="email"
                value={booking.guest_email}
                onChange={(e) => onChange({...booking, guest_email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guest_phone">Телефон гостя</Label>
              <Input
                id="guest_phone"
                value={booking.guest_phone}
                onChange={(e) => onChange({...booking, guest_phone: e.target.value})}
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={onSave}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBookingDialog;
