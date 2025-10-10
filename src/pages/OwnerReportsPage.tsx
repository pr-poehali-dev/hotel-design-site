import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import ReportsTable from '@/components/ReportsTable';
import { BookingRecord } from '@/types/booking';
import { bookingsAPI } from '@/api/bookings';

export default function OwnerReportsPage() {
  const { apartmentId } = useParams<{ apartmentId: string }>();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [ownerInfo, setOwnerInfo] = useState<{ ownerName: string; ownerEmail: string } | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('current');
  const [monthlyReports, setMonthlyReports] = useState<any[]>([]);
  
  const getCurrentMonthName = () => {
    if (selectedMonth === 'current') {
      return new Date().toLocaleDateString('ru', { year: 'numeric', month: 'long' });
    }
    return new Date(selectedMonth + '-01').toLocaleDateString('ru', { year: 'numeric', month: 'long' });
  };

  useEffect(() => {
    const token = localStorage.getItem('ownerToken');
    const ownerId = localStorage.getItem('ownerId');
    
    if (!token || !ownerId) {
      navigate('/owner-login');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const loadData = async () => {
      if (!apartmentId) return;
      
      setLoading(true);
      try {
        const response = await fetch(`https://functions.poehali.dev/03cef8fb-0be9-49db-bf4a-2867e6e483e5?apartment_id=${apartmentId}`);
        if (response.ok) {
          const info = await response.json();
          setOwnerInfo(info);
        }

        const reportsResponse = await fetch(`https://functions.poehali.dev/26b287d9-32f7-4801-bf83-fe0cba67b26e?apartment_id=${apartmentId}`);
        if (reportsResponse.ok) {
          const reports = await reportsResponse.json();
          setMonthlyReports(reports);
        }

        const bookingsData = await bookingsAPI.getBookings(apartmentId);
        const filteredBookings = bookingsData.filter((b: BookingRecord) => b.showToGuest);
        setBookings(filteredBookings);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [apartmentId]);

  useEffect(() => {
    const loadSelectedMonth = async () => {
      if (!apartmentId) return;
      
      if (selectedMonth === 'current') {
        setLoading(true);
        try {
          const bookingsData = await bookingsAPI.getBookings(apartmentId);
          const filteredBookings = bookingsData.filter((b: BookingRecord) => b.showToGuest);
          setBookings(filteredBookings);
        } catch (error) {
          console.error('Failed to load bookings:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(true);
        try {
          const response = await fetch(`https://functions.poehali.dev/26b287d9-32f7-4801-bf83-fe0cba67b26e?apartment_id=${apartmentId}&month=${selectedMonth}`);
          if (response.ok) {
            const data = await response.json();
            let reportData = data.reportData || [];
            
            if (typeof reportData === 'string') {
              reportData = JSON.parse(reportData);
            }
            
            const filteredBookings = reportData.filter((b: any) => b.showToGuest);
            setBookings(filteredBookings);
          }
        } catch (error) {
          console.error('Failed to load archived report:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadSelectedMonth();
  }, [selectedMonth, apartmentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3 md:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 md:mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-white mb-2">
                Апартамент {apartmentId}
              </h1>
              {ownerInfo && (
                <p className="text-sm md:text-base text-slate-300">
                  Собственник: {ownerInfo.ownerName}
                </p>
              )}
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 md:px-4 md:py-2 bg-slate-800/80 border border-purple-500/30 text-white text-sm md:text-base rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            >
              <option value="current">Текущий период</option>
              {monthlyReports.map(report => (
                <option key={report.reportMonth} value={report.reportMonth}>
                  {new Date(report.reportMonth + '-01').toLocaleDateString('ru', { year: 'numeric', month: 'long' })}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-3 md:p-6">
          {bookings.length === 0 ? (
            <div className="text-center text-slate-600 py-6 md:py-8 text-sm md:text-base">
              Нет данных для отображения
            </div>
          ) : (
            <>
              <ReportsTable
                bookings={bookings}
                onEdit={() => {}}
                onDelete={() => {}}
                readOnly={true}
              />
              
              <Card className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 shadow-lg">
                <div className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div>
                      <p className="text-sm md:text-base text-gray-700 font-medium mb-1">
                        Итого к получению за {getCurrentMonthName()}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600">
                        {bookings.length} {bookings.length === 1 ? 'бронирование' : bookings.length < 5 ? 'бронирования' : 'бронирований'}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-3xl md:text-5xl font-bold text-green-600">
                        {bookings.reduce((sum, b) => sum + b.ownerFunds, 0).toLocaleString('ru')} ₽
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}