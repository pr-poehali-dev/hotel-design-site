import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface AddGuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newGuest: {
    email: string;
    password: string;
    name: string;
    phone: string;
    apartment_id: string;
    check_in: string;
    check_out: string;
  };
  onGuestChange: (guest: { email: string; password: string; name: string; phone: string; apartment_id: string; check_in: string; check_out: string }) => void;
  onGeneratePassword: () => void;
  onSubmit: () => void;
}

const AddGuestDialog = ({
  open,
  onOpenChange,
  newGuest,
  onGuestChange,
  onGeneratePassword,
  onSubmit,
}: AddGuestDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-playfair text-2xl">Создать гостя</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="guest@example.com"
              value={newGuest.email}
              onChange={(e) => onGuestChange({ ...newGuest, email: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="password">Пароль *</Label>
            <div className="flex gap-2">
              <Input
                id="password"
                type="text"
                placeholder="Введите или сгенерируйте"
                value={newGuest.password}
                onChange={(e) => onGuestChange({ ...newGuest, password: e.target.value })}
              />
              <Button
                type="button"
                variant="outline"
                onClick={onGeneratePassword}
                title="Сгенерировать пароль"
              >
                <Icon name="RefreshCw" size={18} />
              </Button>
            </div>
            <p className="text-xs text-charcoal-500 mt-1">
              Скопируйте пароль — вам нужно отправить его гостю
            </p>
          </div>

          <div>
            <Label htmlFor="name">Имя</Label>
            <Input
              id="name"
              type="text"
              placeholder="Иван Иванов"
              value={newGuest.name}
              onChange={(e) => onGuestChange({ ...newGuest, name: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="phone">Телефон</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+7 900 123-45-67"
              value={newGuest.phone}
              onChange={(e) => onGuestChange({ ...newGuest, phone: e.target.value })}
            />
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="font-semibold text-charcoal-900 mb-3">Информация о бронировании</h4>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="apartment_id">Номер апартамента *</Label>
                <Input
                  id="apartment_id"
                  type="text"
                  placeholder="2119"
                  value={newGuest.apartment_id}
                  onChange={(e) => onGuestChange({ ...newGuest, apartment_id: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="check_in">Дата заезда *</Label>
                  <Input
                    id="check_in"
                    type="date"
                    value={newGuest.check_in}
                    onChange={(e) => onGuestChange({ ...newGuest, check_in: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="check_out">Дата выезда *</Label>
                  <Input
                    id="check_out"
                    type="date"
                    value={newGuest.check_out}
                    onChange={(e) => onGuestChange({ ...newGuest, check_out: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {newGuest.password && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-semibold text-green-900 mb-2">
                Данные для входа:
              </p>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-green-700">Email:</span>{' '}
                  <code className="bg-white px-2 py-1 rounded border border-green-300">
                    {newGuest.email}
                  </code>
                </p>
                <p>
                  <span className="text-green-700">Пароль:</span>{' '}
                  <code className="bg-white px-2 py-1 rounded border border-green-300">
                    {newGuest.password}
                  </code>
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button
            onClick={onSubmit}
            className="bg-gold-500 hover:bg-gold-600"
          >
            Создать гостя
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddGuestDialog;