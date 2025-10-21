import { useState, useEffect } from 'react';
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

interface AddBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guestId: number;
  guestName: string;
  onSubmit: (bookingData: any) => void;
}

const AddBookingDialog = ({
  open,
  onOpenChange,
  guestId,
  guestName,
  onSubmit,
}: AddBookingDialogProps) => {
  const [formData, setFormData] = useState({
    apartment_id: '',
    check_in: '',
    check_out: '',
    price_per_night: '',
    total_amount: '',
    service_fee_percent: '20',
    owner_funds: '',
    guests_count: '1',
  });
  const [apartments, setApartments] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://functions.poehali.dev/7cb67a25-c7f6-4902-8274-277a31ef2bcf')
      .then(res => res.json())
      .then(data => {
        if (data.apartments) {
          setApartments(data.apartments);
        }
      })
      .catch(err => console.error('Failed to load apartments:', err));
  }, []);

  const handleApartmentChange = (apartmentNumber: string) => {
    const apartment = apartments.find(apt => apt.number === apartmentNumber);
    if (apartment && apartment.price > 0) {
      const pricePerNight = apartment.price.toString();
      const nights = calculateNights();
      
      const currentGuests = parseInt(formData.guests_count) || 1;
      const maxGuests = apartment.max_guests || 10;
      const guestsCount = currentGuests > maxGuests ? maxGuests.toString() : formData.guests_count;
      
      if (nights > 0) {
        const totalAmount = (apartment.price * nights).toFixed(2);
        const serviceFee = parseFloat(formData.service_fee_percent) || 0;
        const ownerFunds = (parseFloat(totalAmount) * (1 - serviceFee / 100)).toFixed(2);
        setFormData({ 
          ...formData, 
          apartment_id: apartmentNumber, 
          price_per_night: pricePerNight,
          total_amount: totalAmount,
          owner_funds: ownerFunds,
          guests_count: guestsCount
        });
      } else {
        setFormData({ ...formData, apartment_id: apartmentNumber, price_per_night: pricePerNight, guests_count: guestsCount });
      }
    } else {
      setFormData({ ...formData, apartment_id: apartmentNumber });
    }
  };

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
      const serviceFee = parseFloat(formData.service_fee_percent) || 0;
      const ownerFunds = (totalNum * (1 - serviceFee / 100)).toFixed(2);
      setFormData({ ...formData, total_amount: total, price_per_night: pricePerNight, owner_funds: ownerFunds });
    } else {
      setFormData({ ...formData, total_amount: total });
    }
  };

  const handlePricePerNightChange = (price: string) => {
    const priceNum = parseFloat(price);
    const nights = calculateNights();
    if (nights > 0 && !isNaN(priceNum)) {
      const totalAmount = (priceNum * nights).toFixed(2);
      const serviceFee = parseFloat(formData.service_fee_percent) || 0;
      const ownerFunds = (parseFloat(totalAmount) * (1 - serviceFee / 100)).toFixed(2);
      setFormData({ ...formData, price_per_night: price, total_amount: totalAmount, owner_funds: ownerFunds });
    } else {
      setFormData({ ...formData, price_per_night: price });
    }
  };

  const handleDateChange = (field: 'check_in' | 'check_out', value: string) => {
    const newFormData = { ...formData, [field]: value };
    
    const checkIn = field === 'check_in' ? new Date(value) : new Date(formData.check_in);
    const checkOut = field === 'check_out' ? new Date(value) : new Date(formData.check_out);
    
    if (value && (field === 'check_in' ? formData.check_out : formData.check_in)) {
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const priceNum = parseFloat(formData.price_per_night);
      if (nights > 0 && !isNaN(priceNum)) {
        const totalAmount = (priceNum * nights).toFixed(2);
        const serviceFee = parseFloat(formData.service_fee_percent) || 0;
        const ownerFunds = (parseFloat(totalAmount) * (1 - serviceFee / 100)).toFixed(2);
        setFormData({ ...newFormData, total_amount: totalAmount, owner_funds: ownerFunds });
        return;
      }
    }
    
    setFormData(newFormData);
  };

  const handleSubmit = () => {
    if (!formData.apartment_id || !formData.check_in || !formData.check_out || !formData.price_per_night) {
      return;
    }
    
    onSubmit({
      guest_id: guestId,
      ...formData,
    });
    
    setFormData({
      apartment_id: '',
      check_in: '',
      check_out: '',
      price_per_night: '',
      total_amount: '',
      service_fee_percent: '20',
      owner_funds: '',
      guests_count: '1',
    });
  };

  const isValid = formData.apartment_id && formData.check_in && formData.check_out && formData.price_per_night;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-playfair text-2xl">Новое бронирование</DialogTitle>
          <p className="text-sm text-charcoal-600">для гостя: {guestName}</p>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="apartment_id">Номер апартамента *</Label>
            <select
              id="apartment_id"
              value={formData.apartment_id}
              onChange={(e) => handleApartmentChange(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Выберите апартамент</option>
              {apartments.map(apt => (
                <option key={apt.number} value={apt.number}>
                  {apt.number} {apt.name && apt.name !== apt.number ? `- ${apt.name}` : ''} {apt.price > 0 ? `(${apt.price}₽/ночь)` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="check_in">Дата заезда *</Label>
              <Input
                id="check_in"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.check_in}
                onChange={(e) => handleDateChange('check_in', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="check_out">Дата выезда *</Label>
              <Input
                id="check_out"
                type="date"
                min={formData.check_in || new Date().toISOString().split('T')[0]}
                value={formData.check_out}
                onChange={(e) => handleDateChange('check_out', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="guests_count">Количество гостей *</Label>
            <Input
              id="guests_count"
              type="number"
              min="1"
              max={formData.apartment_id ? (apartments.find(apt => apt.number === formData.apartment_id)?.max_guests || 10) : 10}
              placeholder="2"
              value={formData.guests_count}
              onChange={(e) => setFormData({ ...formData, guests_count: e.target.value })}
            />
            {formData.apartment_id && apartments.find(apt => apt.number === formData.apartment_id)?.max_guests && (
              <p className="text-xs text-charcoal-500 mt-1">
                Макс. {apartments.find(apt => apt.number === formData.apartment_id)?.max_guests} {apartments.find(apt => apt.number === formData.apartment_id)?.max_guests === 1 ? 'гость' : apartments.find(apt => apt.number === formData.apartment_id)?.max_guests! < 5 ? 'гостя' : 'гостей'}
              </p>
            )}
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="service_fee_percent">Комиссия сервиса (%) *</Label>
              <div className="relative">
                <Input
                  id="service_fee_percent"
                  type="number"
                  placeholder="20"
                  value={formData.service_fee_percent}
                  onChange={(e) => {
                    const serviceFee = e.target.value;
                    const totalNum = parseFloat(formData.total_amount);
                    if (!isNaN(totalNum)) {
                      const ownerFunds = (totalNum * (1 - parseFloat(serviceFee) / 100)).toFixed(2);
                      setFormData({ ...formData, service_fee_percent: serviceFee, owner_funds: ownerFunds });
                    } else {
                      setFormData({ ...formData, service_fee_percent: serviceFee });
                    }
                  }}
                  className="pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-500">%</span>
              </div>
            </div>

            <div>
              <Label htmlFor="owner_funds">Собственнику</Label>
              <div className="relative">
                <Input
                  id="owner_funds"
                  type="number"
                  placeholder="8400"
                  value={formData.owner_funds}
                  readOnly
                  className="pr-10 bg-gray-50"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-500">₽</span>
              </div>
              <p className="text-xs text-charcoal-500 mt-1">
                Автоматически рассчитывается
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="bg-gold-500 hover:bg-gold-600 disabled:opacity-50"
          >
            Создать бронирование
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookingDialog;