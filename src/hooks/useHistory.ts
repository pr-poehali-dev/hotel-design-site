import { useState, useEffect } from 'react';
import { Room, HistoryEntry } from '@/components/housekeeping/types';

export const useHistory = (rooms: Room[], setRooms: (rooms: Room[]) => void) => {
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const savedHistory = localStorage.getItem('housekeeping_history');
    if (savedHistory) {
      try {
        return JSON.parse(savedHistory);
      } catch (e) {
        console.error('Error loading history:', e);
        return [];
      }
    }
    return [];
  });

  const saveToHistory = () => {
    const today = new Date().toISOString().split('T')[0];
    const existingIndex = history.findIndex(h => h.date === today);
    
    let newHistory: HistoryEntry[];
    if (existingIndex >= 0) {
      newHistory = [...history];
      newHistory[existingIndex] = { date: today, rooms: [...rooms] };
    } else {
      newHistory = [...history, { date: today, rooms: [...rooms] }];
    }
    
    newHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setHistory(newHistory);
    localStorage.setItem('housekeeping_history', JSON.stringify(newHistory));
    alert('Данные сохранены в историю!');
  };

  const loadFromHistory = (entry: HistoryEntry) => {
    if (confirm(`Загрузить данные за ${new Date(entry.date).toLocaleDateString('ru-RU')}?`)) {
      setRooms([...entry.rooms]);
      alert('Данные загружены!');
    }
  };

  const deleteFromHistory = (date: string) => {
    const newHistory = history.filter(h => h.date !== date);
    setHistory(newHistory);
    localStorage.setItem('housekeeping_history', JSON.stringify(newHistory));
  };

  return {
    history,
    saveToHistory,
    loadFromHistory,
    deleteFromHistory,
  };
};