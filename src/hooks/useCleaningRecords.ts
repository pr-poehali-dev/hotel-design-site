import { useState, useEffect } from 'react';
import { CleaningRecord } from '@/components/housekeeping/types';

export const useCleaningRecords = () => {
  const [records, setRecords] = useState<CleaningRecord[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('cleaning_records');
    console.log('Loading cleaning records from localStorage:', stored);
    
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('Parsed cleaning records:', parsed);
      setRecords(parsed);
    } else {
      console.log('No cleaning records found in localStorage - creating test record');
      // Создаём тестовую запись для апартамента 2110
      const testRecord: CleaningRecord = {
        id: `test-${Date.now()}`,
        roomNumber: '2110',
        housekeeperName: 'Мария',
        cleanedAt: new Date().toISOString(),
        payment: 500,
        paymentStatus: 'unpaid'
      };
      const initialRecords = [testRecord];
      setRecords(initialRecords);
      localStorage.setItem('cleaning_records', JSON.stringify(initialRecords));
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