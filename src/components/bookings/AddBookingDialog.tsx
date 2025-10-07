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
import Icon from '@/components/ui/icon';
import { Booking } from './types';

interface AddBookingDialogProps {
  open: boolean;
  booking: Booking;
  onClose: () => void;
  onAdd: () => void;
  onChange: (booking: Booking) => void;
}

const AddBookingDialog = ({ open, booking, onClose, onAdd, onChange }: AddBookingDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Добавить нового гостя</DialogTitle>
          <DialogDescription>
            Заполните данные бронирования
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new_guest_name">Имя гостя *</Label>
              <Input
                id="new_guest_name"
                placeholder="Иван Иванов"
                value={booking.guest_name}
                onChange={(e) => onChange({...booking, guest_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new_apartment_id">Номер апартамента *</Label>
              <Input
                id="new_apartment_id"
                placeholder="816"
                value={booking.apartment_id}
                onChange={(e) => onChange({...booking, apartment_id: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new_check_in">Дата заезда *</Label>
              <Input
                id="new_check_in"
                type="date"
                value={booking.check_in}
                onChange={(e) => onChange({...booking, check_in: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new_check_out">Дата выезда *</Label>
              <Input
                id="new_check_out"
                type="date"
                value={booking.check_out}
                onChange={(e) => onChange({...booking, check_out: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="new_guest_email">Email гостя *</Label>
            <Input
              id="new_guest_email"
              type="email"
              placeholder="guest@example.com"
              value={booking.guest_email}
              onChange={(e) => onChange({...booking, guest_email: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new_guest_phone">Телефон гостя</Label>
            <Input
              id="new_guest_phone"
              placeholder="+7 900 123-45-67"
              value={booking.guest_phone}
              onChange={(e) => onChange({...booking, guest_phone: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={onAdd} className="bg-gold-500 hover:bg-gold-600">
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookingDialog;
