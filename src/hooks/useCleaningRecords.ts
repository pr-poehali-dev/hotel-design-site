import { useState, useEffect } from 'react';
import { CleaningRecord } from '@/components/housekeeping/types';
import func2url from '../../backend/func2url.json';

const API_URL = func2url['cleaning-history'];

export const useCleaningRecords = () => {
  const [records, setRecords] = useState<CleaningRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (data.success && data.records) {
        setRecords(data.records);
      }
    } catch (error) {
      console.error('Ошибка загрузки истории уборок:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const addCleaningRecord = async (roomNumber: string, housekeeperName: string, payment: number) => {
    console.log('🔔 addCleaningRecord called:', { 
      roomNumber,
      housekeeperName,
      payment
    });
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomNumber,
          housekeeperName,
          payment
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Запись об уборке сохранена в БД. ID:', data.id);
        // Перезагружаем все записи
        await loadRecords();
      } else {
        console.error('❌ Ошибка сохранения:', data.error);
      }
    } catch (error) {
      console.error('❌ Ошибка запроса:', error);
    }
  };

  const markAsPaid = async (recordId: string) => {
    await updatePaymentStatus(recordId, 'paid');
  };

  const updatePaymentStatus = async (recordId: string, status: 'paid' | 'unpaid', paidAt?: string) => {
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: recordId,
          paymentStatus: status,
          paidAt
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Перезагружаем все записи
        await loadRecords();
      }
    } catch (error) {
      console.error('Ошибка обновления статуса оплаты:', error);
    }
  };

  const getRecordsByHousekeeper = (housekeeperName: string) => {
    return records.filter(r => r.housekeeperName === housekeeperName);
  };

  return {
    records,
    loading,
    addCleaningRecord,
    markAsPaid,
    updatePaymentStatus,
    getRecordsByHousekeeper,
    reload: loadRecords
  };
};
