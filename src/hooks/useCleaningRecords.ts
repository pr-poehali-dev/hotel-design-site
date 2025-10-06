import { useState, useEffect } from 'react';
import { CleaningRecord } from '@/components/housekeeping/types';

export const useCleaningRecords = () => {
  const [records, setRecords] = useState<CleaningRecord[]>([]);

  useEffect(() => {
    // КРИТИЧНО: Принудительная очистка демо-данных
    const needsClear = !localStorage.getItem('records_cleared_v2');
    
    if (needsClear) {
      console.log('Clearing demo records...');
      localStorage.removeItem('cleaning_records');
      localStorage.setItem('records_cleared_v2', 'true');
      setRecords([]);
      return;
    }
    
    const stored = localStorage.getItem('cleaning_records');
    if (stored) {
      setRecords(JSON.parse(stored));
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