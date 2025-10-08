import { useState, useEffect } from 'react';
import { CleaningRecord } from '@/components/housekeeping/types';
import func2url from '../../backend/func2url.json';

const API_URL = func2url['cleaning-history'];

export const useCleaningRecords = () => {
  const [records, setRecords] = useState<CleaningRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRecords = async () => {
    console.log('🚀 loadRecords START. API_URL:', API_URL);
    setLoading(true);
    try {
      console.log('🌐 Делаю fetch запрос к:', API_URL);
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('📡 Response status:', response.status, 'OK:', response.ok);
      
      const data = await response.json();
      
      console.log('📥 Загружены записи из БД:', data);
      console.log('📊 data.success:', data.success);
      console.log('📊 data.records:', data.records);
      console.log('📊 data.records.length:', data.records?.length);
      
      if (data.success && data.records) {
        console.log('✅ Устанавливаю records. Количество:', data.records.length);
        setRecords(data.records);
      } else {
        console.warn('⚠️ data.success или data.records пустые!');
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки истории уборок:', error);
    }
    setLoading(false);
    console.log('🏁 loadRecords END');
  };

  useEffect(() => {
    // Очищаем старые данные из localStorage
    const oldRecords = localStorage.getItem('cleaning_records');
    if (oldRecords) {
      console.log('🗑️ Удаляю старые данные из localStorage');
      localStorage.removeItem('cleaning_records');
    }
    
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

  const deleteRecord = async (recordId: string) => {
    try {
      const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: recordId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Запись удалена. ID:', recordId);
        await loadRecords();
      } else {
        console.error('❌ Ошибка удаления:', data.error);
      }
    } catch (error) {
      console.error('❌ Ошибка запроса удаления:', error);
    }
  };

  return {
    records,
    loading,
    addCleaningRecord,
    markAsPaid,
    updatePaymentStatus,
    getRecordsByHousekeeper,
    deleteRecord,
    reload: loadRecords
  };
};