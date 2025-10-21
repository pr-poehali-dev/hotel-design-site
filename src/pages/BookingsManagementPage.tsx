import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingsHeader from '@/components/bookings/BookingsHeader';
import BookingsCalendarView from '@/components/bookings/BookingsCalendarView';

const BookingsManagementPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin-login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <BookingsHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <BookingsCalendarView />
      </div>
    </div>
  );
};

export default BookingsManagementPage;