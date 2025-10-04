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
}

export interface RoomStats {
  total: number;
  clean: number;
  dirty: number;
  inProgress: number;
  inspection: number;
}
