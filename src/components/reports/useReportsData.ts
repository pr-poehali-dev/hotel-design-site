import { useState, useEffect } from 'react';
import { BookingRecord } from '@/types/booking';
import { bookingsAPI } from '@/api/bookings';

interface Owner {
  apartmentId: string;
  apartmentNumber?: string;
  apartmentName?: string;
  ownerEmail: string;
  ownerName: string;
  commissionRate: number;
}

export const useReportsData = (isAuthenticated: boolean) => {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [selectedApartment, setSelectedApartment] = useState('');
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('current');
  const [monthlyReports, setMonthlyReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [commissionRate, setCommissionRate] = useState<number>(20);

  const loadBookings = async () => {
    if (!selectedApartment) {
      console.log('loadBookings: no apartment selected');
      return;
    }
    
    setLoading(true);
    try {
      const data = await bookingsAPI.getBookings(selectedApartment);
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMonthlyReports = async () => {
    try {
      const response = await fetch(`https://functions.poehali.dev/26b287d9-32f7-4801-bf83-fe0cba67b26e?apartment_id=${selectedApartment}`);
      if (response.ok) {
        const data = await response.json();
        setMonthlyReports(data);
      }
    } catch (error) {
      console.error('Failed to load monthly reports:', error);
    }
  };

  const loadOwners = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/03cef8fb-0be9-49db-bf4a-2867e6e483e5');
      if (response.ok) {
        const data = await response.json();
        setOwners(data);
        if (data.length > 0 && !selectedApartment) {
          setSelectedApartment(data[0].apartmentId);
        }
      }
    } catch (error) {
      console.error('Failed to load owners:', error);
    }
  };

  const updateCommissionRate = async (apartmentId: string, rate: number) => {
    try {
      const response = await fetch('https://functions.poehali.dev/d54660a1-bb13-44aa-a3f9-09772059a519', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apartment_id: apartmentId,
          commission_rate: rate
        })
      });

      if (response.ok) {
        setCommissionRate(rate);
        setOwners(prev => prev.map(owner => 
          owner.apartmentId === apartmentId 
            ? { ...owner, commissionRate: rate }
            : owner
        ));
      }
    } catch (error) {
      console.error('Failed to update commission rate:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadOwners();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedApartment) {
      loadBookings();
      loadMonthlyReports();
    }
  }, [selectedApartment]);

  useEffect(() => {
    if (selectedApartment && owners.length > 0) {
      const currentOwner = owners.find(o => o.apartmentId === selectedApartment);
      if (currentOwner) {
        setCommissionRate(currentOwner.commissionRate || 20);
      }
    }
  }, [selectedApartment, owners]);

  useEffect(() => {
    const loadSelectedMonth = async () => {
      if (!selectedApartment) return;
      
      if (selectedMonth === 'current') {
        loadBookings();
      } else {
        setLoading(true);
        try {
          const response = await fetch(`https://functions.poehali.dev/26b287d9-32f7-4801-bf83-fe0cba67b26e?apartment_id=${selectedApartment}&month=${selectedMonth}`);
          if (response.ok) {
            const data = await response.json();
            setBookings(data.reportData || []);
          }
        } catch (error) {
          console.error('Failed to load archived report:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadSelectedMonth();
  }, [selectedMonth, selectedApartment]);

  return {
    owners,
    selectedApartment,
    setSelectedApartment,
    bookings,
    selectedMonth,
    setSelectedMonth,
    monthlyReports,
    loading,
    setLoading,
    commissionRate,
    loadBookings,
    loadMonthlyReports,
    updateCommissionRate
  };
};