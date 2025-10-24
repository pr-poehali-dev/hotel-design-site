export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  login?: string;
  password?: string;
  is_vip: boolean;
  bookings_count: number;
  total_revenue: number;
  last_visit: string | null;
  notes: string;
  created_at: string;
  avatar_color?: string;
  bonus_points?: number;
}

export interface GuestStats {
  total_guests: number;
  vip_guests: number;
  active_guests: number;
  total_revenue: number;
}

export type GuestFilter = 'all' | 'vip' | 'regular';