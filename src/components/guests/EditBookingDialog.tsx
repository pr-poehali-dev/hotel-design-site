import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface EditBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: {
    id: string;
    apartment_id: string;
    check_in: string;
    check_out: string;
    accommodation_amount: number;
    total_amount: number;
  } | null;
  onSubmit: (bookingData: any) => void;
}

const EditBookingDialog = ({
  open,
  onOpenChange,
  booking,
  onSubmit,
}: EditBookingDialogProps) => {
  const [formData, setFormData] = useState({
    apartment_id: '',
    check_in: '',
    check_out: '',
    price_per_night: '',
    total_amount: '',
  });

  useEffect(() => {
    if (booking) {
      setFormData({
        apartment_id: booking.apartment_id,
        check_in: booking.check_in,
        check_out: booking.check_out,
        price_per_night: booking.accommodation_amount.toString(),
        total_amount: booking.total_amount.toString(),
      });
    }
  }, [booking]);

  const calculateNights = () => {
    if (!formData.check_in || !formData.check_out) return 0;
    const checkIn = new Date(formData.check_in);
    const checkOut = new Date(formData.check_out);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const nights = calculateNights();

  const handleTotalAmountChange = (total: string) => {
    const totalNum = parseFloat(total);
    if (nights > 0 && !isNaN(totalNum)) {
      const pricePerNight = (totalNum / nights).toFixed(2);
      setFormData({ ...formData, total_amount: total, price_per_night: pricePerNight });
    } else {
      setFormData({ ...formData, total_amount: total });
    }
  };

  const handlePricePerNightChange = (price: string) => {
    const priceNum = parseFloat(price);
    if (nights > 0 && !isNaN(priceNum)) {
      const totalAmount = (priceNum * nights).toFixed(2);
      setFormData({ ...formData, price_per_night: price, total_amount: totalAmount });
    } else {
      setFormData({ ...formData, price_per_night: price });
    }
  };

  const handleSubmit = () => {
    if (!booking) return;
    onSubmit({
      booking_id: booking.id,
      ...formData,
    });
  };

  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-playfair text-2xl">Редактировать бронирование</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="apartment_id">Номер апартамента *</Label>
            <Input
              id="apartment_id"
              type="text"
              placeholder="2119"
              value={formData.apartment_id}
              onChange={(e) => setFormData({ ...formData, apartment_id: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="check_in">Дата заезда *</Label>
              <Input
                id="check_in"
                type="date"
                value={formData.check_in}
                onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="check_out">Дата выезда *</Label>
              <Input
                id="check_out"
                type="date"
                value={formData.check_out}
                onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="price_per_night">Цена за ночь *</Label>
              <div className="relative">
                <Input
                  id="price_per_night"
                  type="number"
                  placeholder="3500"
                  value={formData.price_per_night}
                  onChange={(e) => handlePricePerNightChange(e.target.value)}
                  className="pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-500">₽</span>
              </div>
            </div>

            <div>
              <Label htmlFor="total_amount">Общая стоимость *</Label>
              <div className="relative">
                <Input
                  id="total_amount"
                  type="number"
                  placeholder="10500"
                  value={formData.total_amount}
                  onChange={(e) => handleTotalAmountChange(e.target.value)}
                  className="pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-500">₽</span>
              </div>
              {nights > 0 && (
                <p className="text-xs text-charcoal-500 mt-1">
                  {nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gold-500 hover:bg-gold-600"
          >
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBookingDialog;
