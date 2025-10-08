import { Room } from './types';

export const getStatusColor = (status: Room['status']) => {
  switch (status) {
    case 'clean':
      return 'bg-green-500';
    case 'dirty':
      return 'bg-red-500';
    case 'in-progress':
      return 'bg-yellow-500';
    case 'inspection':
      return 'bg-blue-500';
    case 'turnover':
      return 'bg-cyan-500';
    case 'occupied':
      return 'bg-purple-500';
    case 'cleaned':
      return 'bg-emerald-500';
    case 'pending-verification':
      return 'bg-orange-500';
    default:
      return 'bg-gray-500';
  }
};

export const getStatusText = (status: Room['status']) => {
  switch (status) {
    case 'clean':
      return 'Чисто';
    case 'dirty':
      return 'Грязно';
    case 'in-progress':
      return 'В процессе';
    case 'inspection':
      return 'Проверка';
    case 'turnover':
      return 'Текучка';
    case 'occupied':
      return 'Живут';
    case 'cleaned':
      return 'Убрано';
    case 'pending-verification':
      return 'На проверке';
    default:
      return status;
  }
};