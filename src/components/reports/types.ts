export interface OwnerReport {
  id: number;
  apartment_number: string;
  check_in_date: string;
  check_out_date: string;
  booking_sum: number;
  total_sum: number;
  commission_percent: number;
  usn_percent: number;
  commission_before_usn: number;
  commission_after_usn: number;
  remaining_before_expenses: number;
  expenses_on_operations: number;
  average_cleaning: number;
  owner_payment: number;
  payment_date: string | null;
  hot_water: number;
  chemical_cleaning: number;
  hygiene_ср_ва: number;
  transportation: number;
  utilities: number;
  other: number;
  note_to_billing: string | null;
  created_at: string;
}
