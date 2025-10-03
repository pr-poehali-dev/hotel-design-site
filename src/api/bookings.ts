import { BookingRecord } from '@/types/booking';

const API_URL = 'https://functions.poehali.dev/e027968a-93da-4665-8c14-1432cbf823c9';

export const bookingsAPI = {
  async getBookings(apartmentId: string): Promise<BookingRecord[]> {
    const response = await fetch(`${API_URL}?apartment_id=${apartmentId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  async createBooking(booking: BookingRecord): Promise<void> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...booking,
        apartmentId: booking.apartmentId,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to create booking');
    }
  },

  async updateBooking(booking: BookingRecord): Promise<void> {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...booking,
        apartmentId: booking.apartmentId,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to update booking');
    }
  },

  async deleteBooking(id: string, apartmentId: string): Promise<void> {
    const response = await fetch(`${API_URL}?id=${id}&apartment_id=${apartmentId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete booking');
    }
  },
};
