export interface Room {
  id: string;
  number: string;
  floor: number;
  status: 'clean' | 'dirty' | 'in-progress' | 'inspection' | 'turnover' | 'occupied';
  assignedTo: string;
  lastCleaned: string;
  urgent: boolean;
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
  turnover: number;
  occupied: number;
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