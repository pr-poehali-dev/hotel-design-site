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
    price_per_night: string;
    total_amount: string;
  };
  onGuestChange: (guest: { email: string; password: string; name: string; phone: string; apartment_id: string; check_in: string; check_out: string; price_per_night: string; total_amount: string }) => void;
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
  const calculateNights = () => {
    if (!newGuest.check_in || !newGuest.check_out) return 0;
    const checkIn = new Date(newGuest.check_in);
    const checkOut = new Date(newGuest.check_out);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const nights = calculateNights();

  const handleTotalAmountChange = (total: string) => {
    const totalNum = parseFloat(total);
    if (nights > 0 && !isNaN(totalNum)) {
      const pricePerNight = (totalNum / nights).toFixed(2);
      onGuestChange({ ...newGuest, total_amount: total, price_per_night: pricePerNight });
    } else {
      onGuestChange({ ...newGuest, total_amount: total });
    }
  };

  const handlePricePerNightChange = (price: string) => {
    const priceNum = parseFloat(price);
    if (nights > 0 && !isNaN(priceNum)) {
      const totalAmount = (priceNum * nights).toFixed(2);
      onGuestChange({ ...newGuest, price_per_night: price, total_amount: totalAmount });
    } else {
      onGuestChange({ ...newGuest, price_per_night: price });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-playfair text-xl">Создать гостя</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label htmlFor="email" className="text-sm">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="guest@example.com"
              value={newGuest.email}
              onChange={(e) => onGuestChange({ ...newGuest, email: e.target.value })}
              className="h-9"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm">Пароль *</Label>
            <div className="flex gap-2">
              <Input
                id="password"
                type="text"
                placeholder="Введите или сгенерируйте"
                value={newGuest.password}
                onChange={(e) => onGuestChange({ ...newGuest, password: e.target.value })}
                className="h-9"
              />
              <Button
                type="button"
                variant="outline"
                onClick={onGeneratePassword}
                title="Сгенерировать пароль"
                className="h-9 px-3"
              >
                <Icon name="RefreshCw" size={16} />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name" className="text-sm">Имя</Label>
              <Input
                id="name"
                type="text"
                placeholder="Иван Иванов"
                value={newGuest.name}
                onChange={(e) => onGuestChange({ ...newGuest, name: e.target.value })}
                className="h-9"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 900 123-45-67"
                value={newGuest.phone}
                onChange={(e) => onGuestChange({ ...newGuest, phone: e.target.value })}
                className="h-9"
              />
            </div>
          </div>

          <div className="border-t pt-3 mt-3">
            <h4 className="font-semibold text-charcoal-900 mb-2 text-sm">Информация о бронировании</h4>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="apartment_id" className="text-sm">Номер апартамента *</Label>
                <Input
                  id="apartment_id"
                  type="text"
                  placeholder="2119"
                  value={newGuest.apartment_id}
                  onChange={(e) => onGuestChange({ ...newGuest, apartment_id: e.target.value })}
                  className="h-9"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="check_in" className="text-sm">Заезд *</Label>
                  <Input
                    id="check_in"
                    type="date"
                    value={newGuest.check_in}
                    onChange={(e) => onGuestChange({ ...newGuest, check_in: e.target.value })}
                    className="h-9"
                  />
                </div>

                <div>
                  <Label htmlFor="check_out" className="text-sm">Выезд *</Label>
                  <Input
                    id="check_out"
                    type="date"
                    value={newGuest.check_out}
                    onChange={(e) => onGuestChange({ ...newGuest, check_out: e.target.value })}
                    className="h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="price_per_night" className="text-sm">За ночь *</Label>
                  <div className="relative">
                    <Input
                      id="price_per_night"
                      type="number"
                      placeholder="3500"
                      value={newGuest.price_per_night}
                      onChange={(e) => handlePricePerNightChange(e.target.value)}
                      className="pr-8 h-9"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-charcoal-500 text-sm">₽</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="total_amount" className="text-sm">Всего *</Label>
                  <div className="relative">
                    <Input
                      id="total_amount"
                      type="number"
                      placeholder="10500"
                      value={newGuest.total_amount}
                      onChange={(e) => handleTotalAmountChange(e.target.value)}
                      className="pr-8 h-9"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-charcoal-500 text-sm">₽</span>
                  </div>
                </div>
              </div>
              {nights > 0 && (
                <p className="text-xs text-charcoal-500">
                  {nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}
                </p>
              )}
            </div>
          </div>

          {newGuest.password && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs font-semibold text-green-900 mb-1.5">
                Данные для входа:
              </p>
              <div className="space-y-1 text-xs">
                <p>
                  <span className="text-green-700">Email:</span>{' '}
                  <code className="bg-white px-1.5 py-0.5 rounded border border-green-300 text-xs">
                    {newGuest.email}
                  </code>
                </p>
                <p>
                  <span className="text-green-700">Пароль:</span>{' '}
                  <code className="bg-white px-1.5 py-0.5 rounded border border-green-300 text-xs">
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