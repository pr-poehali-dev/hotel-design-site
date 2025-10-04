export interface Room {
  id: string;
  number: string;
  floor: number;
  status: 'clean' | 'dirty' | 'in-progress' | 'inspection';
  assignedTo: string;
  lastCleaned: string;
  checkOut: string;
  checkIn: string;
  priority: 'high' | 'normal' | 'low';
  notes: string;
  payment?: number;
  paymentStatus?: 'paid' | 'unpaid';
}

export interface RoomStats {
  total: number;
  clean: number;
  dirty: number;
  inProgress: number;
  inspection: number;
}

export interface HistoryEntry {
  date: string;
  rooms: Room[];
}

export interface User {
  username: string;
  role: 'admin' | 'housekeeper';
}

export interface StoredUser {
  username: string;
  password: string;
  role: 'admin' | 'housekeeper';
}