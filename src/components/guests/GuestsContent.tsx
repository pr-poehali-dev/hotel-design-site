import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GuestsList, { Guest } from './GuestsList';
import GuestsSearchBar from './GuestsSearchBar';
import EmptyGuestsState from './EmptyGuestsState';

interface GuestsContentProps {
  guests: Guest[];
  filteredAndSortedGuests: Guest[];
  loading: boolean;
  searchQuery: string;
  sortOrder: 'newest' | 'oldest' | 'name';
  onSearchChange: (query: string) => void;
  onSortChange: (order: 'newest' | 'oldest' | 'name') => void;
  onResetPassword: (email: string) => void;
  onDeleteGuest: (id: number) => void;
  onEditBooking: (guestId: number, booking: any) => void;
  onAddBooking: (guestId: number, guestName: string) => void;
  onDeleteBooking: (bookingId: string) => void;
  onClearSearch: () => void;
  onAddGuest: () => void;
}

const GuestsContent = ({
  guests,
  filteredAndSortedGuests,
  loading,
  searchQuery,
  sortOrder,
  onSearchChange,
  onSortChange,
  onResetPassword,
  onDeleteGuest,
  onEditBooking,
  onAddBooking,
  onDeleteBooking,
  onClearSearch,
  onAddGuest,
}: GuestsContentProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
      </div>
    );
  }

  if (guests.length === 0) {
    return <EmptyGuestsState onAddGuest={onAddGuest} />;
  }

  return (
    <>
      <GuestsSearchBar
        searchQuery={searchQuery}
        sortOrder={sortOrder}
        onSearchChange={onSearchChange}
        onSortChange={onSortChange}
      />
      
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
            onResetPassword={onResetPassword}
            onDeleteGuest={onDeleteGuest}
            onEditBooking={onEditBooking}
            onAddBooking={onAddBooking}
            onDeleteBooking={onDeleteBooking}
            onClearSearch={onClearSearch}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default GuestsContent;
