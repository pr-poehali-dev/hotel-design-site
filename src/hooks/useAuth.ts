import { useState, useEffect } from 'react';
import { User, StoredUser } from '@/components/housekeeping/types';

export const DEFAULT_USERS: StoredUser[] = [
  { username: 'hab-agent@mail.ru', password: '3Dyzaape29938172', role: 'admin' },
  { username: 'savasteeva020202@yandex.ru', password: '89261781426', role: 'housekeeper', housekeeperName: 'Савастеева Марина' },
];

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
  
  const [users, setUsers] = useState<StoredUser[]>(() => {
    const savedUsers = localStorage.getItem('housekeeping_users');
    if (savedUsers) {
      try {
        return JSON.parse(savedUsers);
      } catch (e) {
        console.error('Error loading users:', e);
        return DEFAULT_USERS;
      }
    }
    return DEFAULT_USERS;
  });

  const handleLogin = (username: string, password: string) => {
    console.log('=== ПОПЫТКА ВХОДА ===');
    console.log('Введенный логин:', username);
    console.log('Введенный пароль:', password);
    console.log('Доступные пользователи:', users);
    
    const foundUser = users.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    
    console.log('Найденный пользователь:', foundUser);
    
    if (foundUser) {
      // Для горничных используем housekeeperName, для админов - username
      const displayName = foundUser.role === 'housekeeper' && foundUser.housekeeperName 
        ? foundUser.housekeeperName 
        : foundUser.username;
        
      const userToSave = { 
        username: displayName, 
        role: foundUser.role 
      };
      console.log('=== УСПЕШНЫЙ ВХОД ===');
      console.log('foundUser:', foundUser);
      console.log('Сохраняем пользователя:', userToSave);
      setUser(userToSave);
      setLoginError('');
      localStorage.setItem('housekeeping_user', JSON.stringify(userToSave));
    } else {
      console.log('=== ОШИБКА: пользователь не найден ===');
      setLoginError('Неверный логин или пароль');
    }
  };

  const handleAddUser = (newUser: StoredUser) => {
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('housekeeping_users', JSON.stringify(updatedUsers));
  };

  const handleDeleteUser = (username: string) => {
    const updatedUsers = users.filter(u => u.username !== username);
    setUsers(updatedUsers);
    localStorage.setItem('housekeeping_users', JSON.stringify(updatedUsers));
  };

  const handleUpdateUser = (oldUsername: string, updatedUser: StoredUser) => {
    const updatedUsers = users.map(u => 
      u.username === oldUsername ? updatedUser : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('housekeeping_users', JSON.stringify(updatedUsers));
    
    if (user && user.username === oldUsername) {
      setUser({ username: updatedUser.username, role: updatedUser.role });
      localStorage.setItem('housekeeping_user', JSON.stringify({ username: updatedUser.username, role: updatedUser.role }));
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
    handleAddUser,
    handleDeleteUser,
    handleUpdateUser,
    handleLogout,
  };
};