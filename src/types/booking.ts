export interface BookingRecord {
  id: string;
  checkIn: string;
  checkOut: string;
  earlyCheckIn: number;
  lateCheckOut: number;
  parking: number;
  accommodationAmount: number;
  totalAmount: number;
  aggregatorCommission: number;
  taxAndBankCommission: number;
  remainderBeforeManagement: number;
  managementCommission: number;
  remainderBeforeExpenses: number;
  operatingExpenses: number;
  ownerFunds: number;
  paymentToOwner: number;
  paymentDate: string;
  maid: number;
  laundry: number;
  hygiene: number;
  transport: number;
  compliment: number;
  other: number;
  otherNote: string;
  guestEmail?: string;
  guestPhone?: string;
  guestName?: string;
  showToGuest: boolean;
}

export interface MonthlyReport {
  month: string;
  totalAmount: number;
  totalExpenses: number;
  remainderToPay: number;
  bookings: BookingRecord[];
}