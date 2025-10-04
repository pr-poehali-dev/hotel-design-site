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
    default:
      return status;
  }
};