import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Guest } from '@/types/guest';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface GuestDetailsProps {
  guest: Guest;
  onEdit: () => void;
  onDelete: () => void;
  onUpdate?: (updatedGuest: Guest) => void;
}

const GuestDetails = ({ guest, onEdit, onDelete, onUpdate }: GuestDetailsProps) => {
  const { toast } = useToast();
  const [bonusAmount, setBonusAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  
  const loadGuestBookings = async () => {
    setLoadingBookings(true);
    try {
      const response = await fetch(`https://functions.poehali.dev/161fad1a-0c6f-4c29-8baf-f3b052e62b5c?guest_id=${guest.id}`);
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить бронирования',
        variant: 'destructive'
      });
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    loadGuestBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guest.id]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Нет данных';
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleBookingClick = (booking: any) => {
    setSelectedBooking(booking);
    setShowBookingDialog(true);
  };

  const handleBonusChange = async (amount: number) => {
    if (amount === 0) return;
    
    setIsProcessing(true);
    const newBonusPoints = Math.max(0, (guest.bonus_points || 0) + amount);
    
    try {
      const response = await fetch('https://functions.poehali.dev/161fad1a-0c6f-4c29-8baf-f3b052e62b5c', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: guest.id,
          name: guest.name,
          email: guest.email,
          phone: guest.phone,
          is_vip: guest.is_vip,
          notes: guest.notes,
          login: guest.login || '',
          password: guest.password || '',
          bonus_points: newBonusPoints
        })
      });

      const data = await response.json();

      if (response.ok && data.guest) {
        toast({
          title: amount > 0 ? 'Баллы начислены' : 'Баллы списаны',
          description: `${Math.abs(amount)} баллов ${amount > 0 ? 'начислено' : 'списано'}`,
        });
        
        if (onUpdate) {
          onUpdate(data.guest);
        }
        
        setBonusAmount('');
      } else {
        throw new Error(data.error || 'Ошибка обновления баллов');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось обновить баллы',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {guest.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-gray-900">{guest.name}</h2>
                {guest.is_vip && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                    <Icon name="Crown" size={14} className="mr-1" />
                    VIP
                  </Badge>
                )}
              </div>
              <p className="text-gray-500">Гость #{guest.id.slice(0, 8)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onEdit}
              size="sm"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
            >
              <Icon name="Edit" size={16} className="mr-2" />
              Редактировать
            </Button>
            <Button
              onClick={onDelete}
              size="sm"
              variant="destructive"
              className="bg-red-100 hover:bg-red-200 text-red-600 border-red-300"
            >
              <Icon name="Trash2" size={16} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <Icon name="Calendar" size={20} className="text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600">Броней</p>
            <p className="text-xl font-bold text-gray-900">{guest.bookings_count}</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <Icon name="DollarSign" size={20} className="text-green-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600">Доход</p>
            <p className="text-xl font-bold text-gray-900">{guest.total_revenue.toLocaleString('ru-RU')} ₽</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
            <Icon name="Clock" size={20} className="text-purple-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600">Последний визит</p>
            <p className="text-xs font-semibold text-gray-900">{formatDate(guest.last_visit)}</p>
          </div>
        </div>
      </Card>

      {guest.is_vip && (
        <Card className="bg-yellow-50 border-yellow-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="Star" size={20} className="text-yellow-600" />
            Бонусные баллы
          </h3>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-white mb-4">
            <Icon name="Award" size={24} className="text-yellow-600" />
            <div>
              <p className="text-xs text-gray-500">Доступно для списания</p>
              <p className="text-3xl font-bold text-gray-900">{(guest.bonus_points || 0).toLocaleString('ru-RU')} ₽</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-600">Начислить/списать баллы</Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={bonusAmount}
                  onChange={(e) => setBonusAmount(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 mt-1"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button
                  onClick={() => handleBonusChange(parseInt(bonusAmount) || 0)}
                  disabled={!bonusAmount || isProcessing}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <Icon name="Plus" size={16} className="mr-1" />
                  Начислить
                </Button>
                <Button
                  onClick={() => handleBonusChange(-(parseInt(bonusAmount) || 0))}
                  disabled={!bonusAmount || isProcessing || (guest.bonus_points || 0) === 0}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  size="sm"
                >
                  <Icon name="Minus" size={16} className="mr-1" />
                  Списать
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500">Укажите количество баллов для начисления или списания</p>
          </div>
        </Card>
      )}

      {(guest.login || guest.password) && (
        <Card className="bg-cyan-50 border-cyan-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="Key" size={20} className="text-cyan-600" />
            Данные для входа
          </h3>
          <div className="space-y-4">
            {guest.login && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white">
                <Icon name="User" size={18} className="text-gray-600" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Логин</p>
                  <p className="text-gray-900 font-mono">{guest.login}</p>
                </div>
              </div>
            )}
            {guest.password && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white">
                <Icon name="Lock" size={18} className="text-gray-600" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Пароль</p>
                  <p className="text-gray-900 font-mono">{guest.password}</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      <Card className="bg-white border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="Calendar" size={20} className="text-gray-600" />
          История бронирований ({bookings.length})
        </h3>
        
        {loadingBookings ? (
          <div className="text-center py-8 text-gray-500">Загрузка...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Нет бронирований</div>
        ) : (
          <div className="space-y-2">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                onClick={() => handleBookingClick(booking)}
                className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">
                        {formatDate(booking.check_in)} — {formatDate(booking.check_out)}
                      </p>
                      <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                        {booking.apartment_id}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {booking.guests_count || 1} {booking.guests_count === 1 ? 'гость' : 'гостей'} · {booking.status === 'confirmed' ? 'Подтверждено' : booking.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{booking.total_amount.toLocaleString('ru-RU')} ₽</p>
                    <p className="text-xs text-gray-500">{booking.source === 'bnovo' ? 'Bnovo' : 'Прямое'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Детали бронирования</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Заезд</Label>
                  <p className="font-semibold">{formatDate(selectedBooking.check_in)}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Выезд</Label>
                  <p className="font-semibold">{formatDate(selectedBooking.check_out)}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Апартаменты</Label>
                  <p className="font-semibold">{selectedBooking.apartment_id}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Гостей</Label>
                  <p className="font-semibold">{selectedBooking.guests_count || 1}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Статус</Label>
                  <p className="font-semibold">{selectedBooking.status === 'confirmed' ? 'Подтверждено' : selectedBooking.status}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Источник</Label>
                  <p className="font-semibold">{selectedBooking.source === 'bnovo' ? 'Bnovo' : 'Прямое бронирование'}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Финансы</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Проживание:</span>
                    <span className="font-semibold">{selectedBooking.accommodation_amount?.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  {selectedBooking.early_check_in > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ранний заезд:</span>
                      <span className="font-semibold">{selectedBooking.early_check_in?.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  )}
                  {selectedBooking.late_check_out > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Поздний выезд:</span>
                      <span className="font-semibold">{selectedBooking.late_check_out?.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  )}
                  {selectedBooking.parking > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Парковка:</span>
                      <span className="font-semibold">{selectedBooking.parking?.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">Итого:</span>
                    <span className="font-bold text-lg">{selectedBooking.total_amount?.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="border-t pt-4">
                  <Label className="text-xs text-gray-500">Заметки</Label>
                  <p className="text-gray-700 mt-1">{selectedBooking.notes}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <Label className="text-xs text-gray-500">ID бронирования</Label>
                <p className="font-mono text-sm text-gray-600">{selectedBooking.id}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GuestDetails;