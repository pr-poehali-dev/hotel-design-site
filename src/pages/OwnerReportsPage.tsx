import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import ReportsTable from '@/components/ReportsTable';
import { BookingRecord } from '@/types/booking';
import { bookingsAPI } from '@/api/bookings';

export default function OwnerReportsPage() {
  const { apartmentId } = useParams<{ apartmentId: string }>();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [ownerInfo, setOwnerInfo] = useState<{ ownerName: string; ownerEmail: string } | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('current');
  const [monthlyReports, setMonthlyReports] = useState<any[]>([]);

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
            const filteredBookings = (data.reportData || []).filter((b: BookingRecord) => b.showToGuest);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Отчеты по апартаменту {apartmentId}
              </h1>
              {ownerInfo && (
                <p className="text-slate-300">
                  Собственник: {ownerInfo.ownerName}
                </p>
              )}
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 bg-slate-800/80 border border-purple-500/30 text-white rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
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

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
          {bookings.length === 0 ? (
            <div className="text-center text-slate-300 py-8">
              Нет данных для отображения
            </div>
          ) : (
            <ReportsTable
              bookings={bookings}
              onEdit={() => {}}
              onDelete={() => {}}
              readOnly={true}
            />
          )}
        </Card>
      </div>
    </div>
  );
}