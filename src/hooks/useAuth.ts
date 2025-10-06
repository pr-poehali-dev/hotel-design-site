import { useState } from 'react';
import { User, StoredUser } from '@/components/housekeeping/types';
import func2url from '../../backend/func2url.json';

const AUTH_API = func2url['auth-housekeepers'];

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('housekeeping_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error('Error loading user:', e);
        return null;
      }
    }
    return null;
  });
  
  const [loginError, setLoginError] = useState('');
  const [users, setUsers] = useState<StoredUser[]>([]);

  const handleLogin = async (username: string, password: string) => {
    console.log('=== ПОПЫТКА ВХОДА ЧЕРЕЗ API ===');
    console.log('Логин:', username);
    
    try {
      const response = await fetch(AUTH_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      console.log('Ответ API:', data);
      
      if (response.ok) {
        const userToSave = { 
          username: data.username,  // Имя из БД, не email
          role: data.role 
        };
        console.log('=== УСПЕШНЫЙ ВХОД ===');
        console.log('Сохраняем:', userToSave);
        setUser(userToSave);
        setLoginError('');
        localStorage.setItem('housekeeping_user', JSON.stringify(userToSave));
      } else {
        console.log('=== ОШИБКА ВХОДА ===');
        setLoginError('Неверный логин или пароль');
      }
    } catch (error) {
      console.error('Ошибка запроса:', error);
      setLoginError('Ошибка подключения к серверу');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('housekeeping_user');
    window.location.reload();
  };

  return {
    user,
    users,
    loginError,
    handleLogin,
    handleLogout,
  };
};