import { useState, useEffect } from 'react';
import { CleaningRecord } from '@/components/housekeeping/types';

// Тестовые данные для демонстрации
const DEMO_RECORDS: CleaningRecord[] = [
  {
    id: '1',
    roomNumber: '501',
    housekeeperName: 'Мария',
    cleanedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 дней назад
    payment: 500,
    paymentStatus: 'unpaid'
  },
  {
    id: '2',
    roomNumber: '502',
    housekeeperName: 'Мария',
    cleanedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 дня назад
    payment: 500,
    paymentStatus: 'unpaid'
  },
  {
    id: '3',
    roomNumber: '601',
    housekeeperName: 'Елена',
    cleanedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 дня назад
    payment: 700,
    paymentStatus: 'paid',
    paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString() // 1 день назад
  },
  {
    id: '4',
    roomNumber: '602',
    housekeeperName: 'Ольга',
    cleanedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 дня назад
    payment: 500,
    paymentStatus: 'unpaid'
  },
  {
    id: '5',
    roomNumber: '503',
    housekeeperName: 'Мария',
    cleanedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 часов назад
    payment: 500,
    paymentStatus: 'unpaid'
  }
];

export const useCleaningRecords = () => {
  const [records, setRecords] = useState<CleaningRecord[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('cleaning_records');
    if (stored) {
      setRecords(JSON.parse(stored));
    } else {
      // Инициализация тестовыми данными при первом запуске
      setRecords(DEMO_RECORDS);
      localStorage.setItem('cleaning_records', JSON.stringify(DEMO_RECORDS));
    }
  }, []);

  const saveRecords = (newRecords: CleaningRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem('cleaning_records', JSON.stringify(newRecords));
  };

  const addCleaningRecord = (roomNumber: string, housekeeperName: string, payment: number) => {
    const newRecord: CleaningRecord = {
      id: `${Date.now()}-${Math.random()}`,
      roomNumber,
      housekeeperName,
      cleanedAt: new Date().toISOString(),
      payment,
      paymentStatus: 'unpaid'
    };

    console.log('addCleaningRecord called:', { newRecord, currentRecords: records.length });
    const updatedRecords = [...records, newRecord];
    console.log('Saving records:', updatedRecords);
    saveRecords(updatedRecords);
  };

  const markAsPaid = (recordId: string) => {
    const updatedRecords = records.map(r => 
      r.id === recordId ? { ...r, paymentStatus: 'paid' as const } : r
    );
    saveRecords(updatedRecords);
  };

  const updatePaymentStatus = (recordId: string, status: 'paid' | 'unpaid', paidAt?: string) => {
    const updatedRecords = records.map(r => 
      r.id === recordId ? { ...r, paymentStatus: status, paidAt } : r
    );
    saveRecords(updatedRecords);
  };

  const getRecordsByHousekeeper = (housekeeperName: string) => {
    return records.filter(r => r.housekeeperName === housekeeperName);
  };

  return {
    records,
    addCleaningRecord,
    markAsPaid,
    updatePaymentStatus,
    getRecordsByHousekeeper
  };
};