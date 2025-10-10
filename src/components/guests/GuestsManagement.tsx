import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import GuestsList from './GuestsList';
import GuestsSearchBar from './GuestsSearchBar';
import AddGuestDialog from './AddGuestDialog';
import ResetPasswordDialog from './ResetPasswordDialog';
import GuestsInstructions from './GuestsInstructions';
import EmptyGuestsState from './EmptyGuestsState';
import EditBookingDialog from './EditBookingDialog';
import AddBookingDialog from './AddBookingDialog';
import { useGuestsData } from './useGuestsData';
import { useGuestActions } from './useGuestActions';
import { usePasswordReset } from './usePasswordReset';
import { useBookingActions } from './useBookingActions';

const GuestsManagement = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showEditBookingDialog, setShowEditBookingDialog] = useState(false);
  const [showAddBookingDialog, setShowAddBookingDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'name'>('newest');
  const { toast } = useToast();

  const { guests, loading, loadGuests } = useGuestsData(toast);
  
  const {
    newGuest,
    setNewGuest,
    handleAddGuest,
    handleDeleteGuest,
    generatePassword
  } = useGuestActions(toast, loadGuests);
  
  const {
    resetEmail,
    setResetEmail,
    resetPassword,
    setResetPassword,
    handleResetPassword,
    generateResetPassword
  } = usePasswordReset(toast);
  
  const {
    editingBooking,
    setEditingBooking,
    selectedGuestId,
    selectedGuestName,
    handleEditBooking,
    handleAddBooking,
    handleCreateBooking,
    handleUpdateBooking,
    handleDeleteBooking
  } = useBookingActions(toast, loadGuests);

  const onAddGuest = async () => {
    const success = await handleAddGuest();
    if (success) {
      setShowAddDialog(false);
    }
  };

  const onResetPassword = async () => {
    const success = await handleResetPassword();
    if (success) {
      setShowResetDialog(false);
    }
  };

  const onEditBooking = (guestId: number, booking: any) => {
    handleEditBooking(guestId, booking);
    setShowEditBookingDialog(true);
  };

  const onAddBooking = (guestId: number, guestName: string) => {
    handleAddBooking(guestId, guestName);
    setShowAddBookingDialog(true);
  };

  const onCreateBooking = async (bookingData: any) => {
    const success = await handleCreateBooking(bookingData);
    if (success) {
      setShowAddBookingDialog(false);
    }
  };

  const onUpdateBooking = async (bookingData: any) => {
    const success = await handleUpdateBooking(bookingData);
    if (success) {
      setShowEditBookingDialog(false);
    }
  };

  const filteredAndSortedGuests = guests
    .filter((guest) => {
      const query = searchQuery.toLowerCase();
      return (
        guest.email.toLowerCase().includes(query) ||
        guest.name?.toLowerCase().includes(query) ||
        guest.phone?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else {
        return (a.name || '').localeCompare(b.name || '');
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-charcoal-900">
            Гости и бронирования
          </h2>
          <p className="text-charcoal-600 mt-1">
            Управляйте гостями и их бронированиями в одном месте
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowResetDialog(true)}
            variant="outline"
            className="border-gold-300 text-gold-700 hover:bg-gold-50"
          >
            <Icon name="KeyRound" size={18} className="mr-2" />
            Сбросить пароль
          </Button>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-gold-500 hover:bg-gold-600"
          >
            <Icon name="UserPlus" size={18} className="mr-2" />
            Добавить гостя
          </Button>
        </div>
      </div>

      {guests.length > 0 && (
        <GuestsSearchBar
          searchQuery={searchQuery}
          sortOrder={sortOrder}
          onSearchChange={setSearchQuery}
          onSortChange={setSortOrder}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
        </div>
      ) : guests.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>
              Список гостей ({filteredAndSortedGuests.length}
              {filteredAndSortedGuests.length !== guests.length && ` из ${guests.length}`})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GuestsList
              guests={filteredAndSortedGuests}
              searchQuery={searchQuery}
              onResetPassword={(email) => {
                setResetEmail(email);
                setShowResetDialog(true);
              }}
              onDeleteGuest={handleDeleteGuest}
              onEditBooking={onEditBooking}
              onAddBooking={onAddBooking}
              onDeleteBooking={handleDeleteBooking}
              onClearSearch={() => setSearchQuery('')}
            />
          </CardContent>
        </Card>
      ) : (
        <EmptyGuestsState onAddGuest={() => setShowAddDialog(true)} />
      )}

      <GuestsInstructions />

      <AddGuestDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        newGuest={newGuest}
        onGuestChange={setNewGuest}
        onGeneratePassword={generatePassword}
        onSubmit={onAddGuest}
      />

      <ResetPasswordDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        resetEmail={resetEmail}
        resetPassword={resetPassword}
        onEmailChange={setResetEmail}
        onPasswordChange={setResetPassword}
        onGeneratePassword={generateResetPassword}
        onSubmit={onResetPassword}
      />

      <EditBookingDialog
        open={showEditBookingDialog}
        onOpenChange={setShowEditBookingDialog}
        booking={editingBooking}
        onSubmit={onUpdateBooking}
      />

      <AddBookingDialog
        open={showAddBookingDialog}
        onOpenChange={setShowAddBookingDialog}
        guestId={selectedGuestId}
        guestName={selectedGuestName}
        onSubmit={onCreateBooking}
      />
    </div>
  );
};

export default GuestsManagement;