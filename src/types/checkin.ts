export interface CheckInInstruction {
  id: string;
  apartment_id: string;
  title: string;
  description?: string;
  images: string[];
  pdf_files?: string[];
  instruction_text?: string;
  important_notes?: string;
  contact_info?: string;
  wifi_info?: string;
  parking_info?: string;
  house_rules?: string;
}

export interface Apartment {
  id: string;
  name: string;
}
