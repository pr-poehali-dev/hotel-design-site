import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import BookingsHeader from '@/components/bookings/BookingsHeader';
import BookingsList from '@/components/bookings/BookingsList';
import EditBookingDialog from '@/components/bookings/EditBookingDialog';
import AddBookingDialog from '@/components/bookings/AddBookingDialog';
import DeleteConfirmDialog from '@/components/bookings/DeleteConfirmDialog';
import ManageInstructionsDialog from '@/components/bookings/ManageInstructionsDialog';
import { Booking } from '@/components/bookings/types';

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

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin-login');
    }
  }, [navigate]);

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

  const handleManageInstructions = (apartmentId: string, guestName: string) => {
    setManagingInstructions({ apartmentId, guestName });
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
      <BookingsHeader />

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
          <BookingsList
            bookings={bookings}
            onAddNew={() => setIsAddingNew(true)}
            onEdit={handleEdit}
            onDelete={(id) => setDeleteConfirm(id)}
            onManageInstructions={handleManageInstructions}
            onOpenGuestDashboard={handleOpenGuestDashboard}
          />
        </div>
      </div>

      <EditBookingDialog
        booking={editingBooking}
        onClose={() => setEditingBooking(null)}
        onSave={handleSaveEdit}
        onChange={setEditingBooking}
      />

      <DeleteConfirmDialog
        bookingId={deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
      />

      <AddBookingDialog
        open={isAddingNew}
        booking={newBooking}
        onClose={() => setIsAddingNew(false)}
        onAdd={handleAddNew}
        onChange={setNewBooking}
      />

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