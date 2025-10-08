import GuestsHeader from './GuestsHeader';
import GuestsContent from './GuestsContent';
import AddGuestDialog from './AddGuestDialog';
import ResetPasswordDialog from './ResetPasswordDialog';
import EditBookingDialog from './EditBookingDialog';
import AddBookingDialog from './AddBookingDialog';
import GuestsInstructions from './GuestsInstructions';
import { useGuestsManagement } from '@/hooks/useGuestsManagement';

const GuestsManagement = () => {
  const {
    guests,
    loading,
    showAddDialog,
    setShowAddDialog,
    showResetDialog,
    setShowResetDialog,
    showEditBookingDialog,
    setShowEditBookingDialog,
    showAddBookingDialog,
    setShowAddBookingDialog,
    editingBooking,
    selectedGuestId,
    selectedGuestName,
    resetEmail,
    setResetEmail,
    resetPassword,
    setResetPassword,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    newGuest,
    setNewGuest,
    filteredAndSortedGuests,
    handleAddGuest,
    generatePassword,
    generateResetPassword,
    handleResetPassword,
    handleEditBooking,
    handleAddBooking,
    handleCreateBooking,
    handleUpdateBooking,
    handleDeleteBooking,
    handleDeleteGuest,
  } = useGuestsManagement();

  return (
    <div className="space-y-6">
      <GuestsHeader
        onAddGuest={() => setShowAddDialog(true)}
        onResetPassword={() => setShowResetDialog(true)}
      />

      <GuestsContent
        guests={guests}
        filteredAndSortedGuests={filteredAndSortedGuests}
        loading={loading}
        searchQuery={searchQuery}
        sortOrder={sortOrder}
        onSearchChange={setSearchQuery}
        onSortChange={setSortOrder}
        onResetPassword={(email) => {
          setResetEmail(email);
          setShowResetDialog(true);
        }}
        onDeleteGuest={handleDeleteGuest}
        onEditBooking={handleEditBooking}
        onAddBooking={handleAddBooking}
        onDeleteBooking={handleDeleteBooking}
        onClearSearch={() => setSearchQuery('')}
        onAddGuest={() => setShowAddDialog(true)}
      />

      <GuestsInstructions />

      <AddGuestDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        newGuest={newGuest}
        onGuestChange={setNewGuest}
        onGeneratePassword={generatePassword}
        onSubmit={handleAddGuest}
      />

      <ResetPasswordDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        resetEmail={resetEmail}
        resetPassword={resetPassword}
        onEmailChange={setResetEmail}
        onPasswordChange={setResetPassword}
        onGeneratePassword={generateResetPassword}
        onSubmit={handleResetPassword}
      />

      <EditBookingDialog
        open={showEditBookingDialog}
        onOpenChange={setShowEditBookingDialog}
        booking={editingBooking}
        onSubmit={handleUpdateBooking}
      />

      <AddBookingDialog
        open={showAddBookingDialog}
        onOpenChange={setShowAddBookingDialog}
        guestId={selectedGuestId}
        guestName={selectedGuestName}
        onSubmit={handleCreateBooking}
      />
    </div>
  );
};

export default GuestsManagement;
