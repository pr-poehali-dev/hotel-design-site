import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import SendGuestEmailButton from '@/components/housekeeping/SendGuestEmailButton';
import { Badge } from '@/components/ui/badge';
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
import ManageInstructionsDialog from '@/components/bookings/ManageInstructionsDialog';

interface Booking {
  id: string;
  apartment_id: string;
  check_in: string;
  check_out: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  show_to_guest: boolean;
}

const BookingsManagementPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [managingInstructions, setManagingInstructions] = useState<{ apartmentId: string; guestName: string } | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newBooking, setNewBooking] = useState<Booking>({
    id: '',
    apartment_id: '',
    check_in: '',
    check_out: '',
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    show_to_guest: false,
  });
  const navigate = useNavigate();

  const loadBookings = () => {
    const savedBookings = localStorage.getItem('bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
    setLoading(false);
  };

  const saveBookings = (newBookings: Booking[]) => {
    localStorage.setItem('bookings', JSON.stringify(newBookings));
    setBookings(newBookings);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };

  const getStatusBadge = (checkIn: string, checkOut: string) => {
    const today = new Date();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (today < checkInDate) {
      return <Badge className="bg-blue-500">Предстоящее</Badge>;
    } else if (today >= checkInDate && today <= checkOutDate) {
      return <Badge className="bg-green-500">Активное</Badge>;
    } else {
      return <Badge variant="outline">Завершено</Badge>;
    }
  };

  const handleDelete = (id: string) => {
    const newBookings = bookings.filter(b => b.id !== id);
    saveBookings(newBookings);
    setDeleteConfirm(null);
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
  };

  const handleSaveEdit = () => {
    if (editingBooking) {
      const newBookings = bookings.map(b => 
        b.id === editingBooking.id ? editingBooking : b
      );
      saveBookings(newBookings);
      setEditingBooking(null);
    }
  };

  const handleOpenGuestDashboard = (bookingId: string) => {
    navigate(`/guest-dashboard?booking=${bookingId}`);
  };

  const handleAddNew = () => {
    if (!newBooking.guest_name || !newBooking.apartment_id || !newBooking.check_in || !newBooking.check_out || !newBooking.guest_email) {
      alert('Заполните все обязательные поля!');
      return;
    }

    const booking: Booking = {
      ...newBooking,
      id: `BK${Date.now()}`,
    };

    const updatedBookings = [...bookings, booking];
    saveBookings(updatedBookings);
    
    setNewBooking({
      id: '',
      apartment_id: '',
      check_in: '',
      check_out: '',
      guest_name: '',
      guest_email: '',
      guest_phone: '',
      show_to_guest: false,
    });
    setIsAddingNew(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Icon name="Loader2" size={48} className="animate-spin text-gold-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-white py-8 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <a 
                href="/" 
                className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-200 to-gold-400 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-playfair font-bold text-charcoal-900">P9</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold-300 rounded-full opacity-80"></div>
                </div>
                <span className="font-playfair font-bold text-white text-xs">Premium Apartments</span>
              </a>
              <div className="border-l border-white/30 pl-4 ml-2">
                <h1 className="text-2xl font-bold font-playfair">Управление бронированиями</h1>
                <p className="text-gold-100 text-sm">Отправка инструкций гостям</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="text-white border-white hover:bg-white/10"
                onClick={() => {
                  localStorage.removeItem('adminAuthenticated');
                  navigate('/admin-login');
                }}
              >
                <Icon name="LogOut" size={18} className="mr-2" />
                Выход
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white"
              onClick={() => window.location.href = '/bookings'}
            >
              <Icon name="Calendar" size={18} className="mr-2" />
              Управление бронями
            </Button>
            <Button 
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white"
              onClick={() => window.location.href = '/instructions-list'}
            >
              <Icon name="List" size={18} className="mr-2" />
              Все инструкции
            </Button>
            <Button 
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white"
              onClick={() => window.location.href = '/check-in-instructions'}
            >
              <Icon name="FileText" size={18} className="mr-2" />
              Создать инструкции
            </Button>
            <Button 
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white"
              onClick={() => window.location.href = '/guest-dashboard'}
            >
              <Icon name="Eye" size={18} className="mr-2" />
              Посмотреть как видит гость
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-charcoal-900">
            Список бронирований ({bookings.length})
          </h2>
          <Button
            onClick={() => setIsAddingNew(true)}
            className="bg-gold-500 hover:bg-gold-600"
          >
            <Icon name="Plus" size={18} className="mr-2" />
            Добавить гостя
          </Button>
        </div>

        <div className="grid gap-6">
          {bookings.length === 0 ? (
            <Card className="p-12 text-center">
              <Icon name="Users" size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 text-lg mb-4">Пока нет бронирований</p>
              <Button
                onClick={() => setIsAddingNew(true)}
                className="bg-gold-500 hover:bg-gold-600"
              >
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить первого гостя
              </Button>
            </Card>
          ) : (
            bookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl font-playfair">
                        {booking.guest_name}
                      </CardTitle>
                      {getStatusBadge(booking.check_in, booking.check_out)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Icon name="Home" size={16} className="mr-1" />
                        Апартамент {booking.apartment_id}
                      </div>
                      <div className="flex items-center">
                        <Icon name="Mail" size={16} className="mr-1" />
                        {booking.guest_email}
                      </div>
                      <div className="flex items-center">
                        <Icon name="Phone" size={16} className="mr-1" />
                        {booking.guest_phone}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Icon name="Calendar" size={16} className="mr-2" />
                      Заезд
                    </div>
                    <p className="font-semibold text-charcoal-900">
                      {formatDate(booking.check_in)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Icon name="Calendar" size={16} className="mr-2" />
                      Выезд
                    </div>
                    <p className="font-semibold text-charcoal-900">
                      {formatDate(booking.check_out)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Icon name="Hash" size={16} className="mr-2" />
                      Номер брони
                    </div>
                    <p className="font-semibold text-charcoal-900">{booking.id}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {booking.show_to_guest ? (
                      <div className="flex items-center text-green-600 text-sm">
                        <Icon name="CheckCircle" size={16} className="mr-2" />
                        Email отправлен
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-500 text-sm">
                        <Icon name="Mail" size={16} className="mr-2" />
                        Email не отправлен
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      variant="default" 
                      size="sm"
                      className="bg-gold-500 hover:bg-gold-600"
                      onClick={() => setManagingInstructions({ apartmentId: booking.apartment_id, guestName: booking.guest_name })}
                    >
                      <Icon name="FileText" size={16} className="mr-2" />
                      Инструкции
                    </Button>
                    <SendGuestEmailButton
                      bookingId={booking.id}
                      apartmentId={booking.apartment_id}
                      guestEmail={booking.guest_email}
                      guestName={booking.guest_name}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOpenGuestDashboard(booking.id)}
                    >
                      <Icon name="ExternalLink" size={16} className="mr-2" />
                      Открыть кабинет
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(booking)}
                    >
                      <Icon name="Edit" size={16} className="mr-2" />
                      Редактировать
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => setDeleteConfirm(booking.id)}
                    >
                      <Icon name="Trash2" size={16} className="mr-2" />
                      Удалить
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </div>
      </div>

      {/* Диалог редактирования */}
      <Dialog open={!!editingBooking} onOpenChange={() => setEditingBooking(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактировать бронирование</DialogTitle>
            <DialogDescription>
              Измените данные бронирования и нажмите "Сохранить"
            </DialogDescription>
          </DialogHeader>
          {editingBooking && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guest_name">Имя гостя</Label>
                  <Input
                    id="guest_name"
                    value={editingBooking.guest_name}
                    onChange={(e) => setEditingBooking({...editingBooking, guest_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apartment_id">Номер апартамента</Label>
                  <Input
                    id="apartment_id"
                    value={editingBooking.apartment_id}
                    onChange={(e) => setEditingBooking({...editingBooking, apartment_id: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="check_in">Дата заезда</Label>
                  <Input
                    id="check_in"
                    type="date"
                    value={editingBooking.check_in}
                    onChange={(e) => setEditingBooking({...editingBooking, check_in: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="check_out">Дата выезда</Label>
                  <Input
                    id="check_out"
                    type="date"
                    value={editingBooking.check_out}
                    onChange={(e) => setEditingBooking({...editingBooking, check_out: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="guest_email">Email гостя</Label>
                <Input
                  id="guest_email"
                  type="email"
                  value={editingBooking.guest_email}
                  onChange={(e) => setEditingBooking({...editingBooking, guest_email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guest_phone">Телефон гостя</Label>
                <Input
                  id="guest_phone"
                  value={editingBooking.guest_phone}
                  onChange={(e) => setEditingBooking({...editingBooking, guest_phone: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingBooking(null)}>
              Отмена
            </Button>
            <Button onClick={handleSaveEdit}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить бронирование?</DialogTitle>
            <DialogDescription>
              Это действие нельзя отменить. Бронирование будет удалено безвозвратно.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Отмена
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог добавления нового гостя */}
      <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
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
                  value={newBooking.guest_name}
                  onChange={(e) => setNewBooking({...newBooking, guest_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_apartment_id">Номер апартамента *</Label>
                <Input
                  id="new_apartment_id"
                  placeholder="816"
                  value={newBooking.apartment_id}
                  onChange={(e) => setNewBooking({...newBooking, apartment_id: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new_check_in">Дата заезда *</Label>
                <Input
                  id="new_check_in"
                  type="date"
                  value={newBooking.check_in}
                  onChange={(e) => setNewBooking({...newBooking, check_in: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_check_out">Дата выезда *</Label>
                <Input
                  id="new_check_out"
                  type="date"
                  value={newBooking.check_out}
                  onChange={(e) => setNewBooking({...newBooking, check_out: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new_guest_email">Email гостя *</Label>
              <Input
                id="new_guest_email"
                type="email"
                placeholder="guest@example.com"
                value={newBooking.guest_email}
                onChange={(e) => setNewBooking({...newBooking, guest_email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new_guest_phone">Телефон гостя</Label>
              <Input
                id="new_guest_phone"
                placeholder="+7 900 123-45-67"
                value={newBooking.guest_phone}
                onChange={(e) => setNewBooking({...newBooking, guest_phone: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingNew(false)}>
              Отмена
            </Button>
            <Button onClick={handleAddNew} className="bg-gold-500 hover:bg-gold-600">
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог управления инструкциями */}
      {managingInstructions && (
        <ManageInstructionsDialog
          open={!!managingInstructions}
          onOpenChange={(open) => !open && setManagingInstructions(null)}
          apartmentId={managingInstructions.apartmentId}
          guestName={managingInstructions.guestName}
        />
      )}
    </div>
  );
};

export default BookingsManagementPage;