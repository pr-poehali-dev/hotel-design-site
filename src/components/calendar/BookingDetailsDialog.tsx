import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

interface Booking {
  id: string;
  apartment_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  total_amount: number;
  aggregator_commission?: number;
  is_prepaid?: boolean;
  prepayment_amount?: number;
  prepayment_date?: string;
}

interface BookingDetailsDialogProps {
  booking: Booking;
  onClose: () => void;
  onUpdate: (booking: Booking) => void;
}

export default function BookingDetailsDialog({ 
  booking, 
  onClose,
  onUpdate 
}: BookingDetailsDialogProps) {
  const [isPrepaid, setIsPrepaid] = useState(booking.is_prepaid || false);
  const [prepaymentAmount, setPrepaymentAmount] = useState(booking.prepayment_amount?.toString() || '0');
  const [loading, setLoading] = useState(false);

  const isUpcoming = new Date(booking.check_in) > new Date();

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/42f08a7b-0e59-4277-b467-1ceb942afe5e', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: booking.id,
          is_prepaid: isPrepaid,
          prepayment_amount: parseFloat(prepaymentAmount)
        })
      });

      if (response.ok) {
        onUpdate({
          ...booking,
          is_prepaid: isPrepaid,
          prepayment_amount: parseFloat(prepaymentAmount)
        });
        onClose();
      } else {
        alert('Ошибка при обновлении данных');
      }
    } catch (error) {
      console.error('Failed to update booking:', error);
      alert('Ошибка при обновлении данных');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="bg-slate-900 border-white/20 p-6 max-w-md w-full space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Детали бронирования</h3>
          <Button onClick={onClose} variant="ghost" size="sm">
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-400">Гость</label>
            <p className="text-white font-medium">{booking.guest_name}</p>
          </div>

          <div>
            <label className="text-sm text-slate-400">Апартамент</label>
            <p className="text-white font-medium">{booking.apartment_id}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-400">Заезд</label>
              <p className="text-white">{new Date(booking.check_in).toLocaleDateString('ru')}</p>
            </div>
            <div>
              <label className="text-sm text-slate-400">Выезд</label>
              <p className="text-white">{new Date(booking.check_out).toLocaleDateString('ru')}</p>
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400">Сумма проживания</label>
            <p className="text-white font-medium">{booking.total_amount.toLocaleString('ru')} ₽</p>
          </div>

          {booking.guest_email && (
            <div>
              <label className="text-sm text-slate-400">Email</label>
              <p className="text-white">{booking.guest_email}</p>
            </div>
          )}

          {booking.guest_phone && (
            <div>
              <label className="text-sm text-slate-400">Телефон</label>
              <p className="text-white">{booking.guest_phone}</p>
            </div>
          )}

          {isUpcoming && (
            <>
              <div className="border-t border-white/20 pt-3 mt-3">
                <h4 className="text-white font-semibold mb-3">Предоплата</h4>
                
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    id="is_prepaid"
                    checked={isPrepaid}
                    onChange={(e) => setIsPrepaid(e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                  <label htmlFor="is_prepaid" className="text-white cursor-pointer">
                    Получена предоплата
                  </label>
                </div>

                {isPrepaid && (
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Сумма предоплаты (₽)</label>
                    <Input
                      type="number"
                      value={prepaymentAmount}
                      onChange={(e) => setPrepaymentAmount(e.target.value)}
                      placeholder="0"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-3">
                <Button 
                  onClick={handleSave} 
                  disabled={loading}
                  className="flex-1 hover:scale-105 active:scale-95 transition-all"
                >
                  <Icon name="Check" size={16} />
                  Сохранить
                </Button>
                <Button 
                  onClick={onClose} 
                  variant="outline"
                  className="flex-1 hover:scale-105 active:scale-95 transition-all"
                >
                  Отмена
                </Button>
              </div>
            </>
          )}

          {!isUpcoming && (
            <div className="pt-3">
              <Button 
                onClick={onClose} 
                className="w-full"
              >
                Закрыть
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
