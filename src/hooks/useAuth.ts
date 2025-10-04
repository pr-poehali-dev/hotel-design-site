import { useState, useEffect } from 'react';
import { User, StoredUser } from '@/components/housekeeping/types';

export const DEFAULT_USERS: StoredUser[] = [
  { username: 'hab-agent@mail.ru', password: '3Dyzaape29938172', role: 'admin' },
  { username: 'maria', password: 'maria123', role: 'housekeeper' },
  { username: 'elena', password: 'elena123', role: 'housekeeper' },
  { username: 'olga', password: 'olga123', role: 'housekeeper' },
  { username: 'anna', password: 'anna123', role: 'housekeeper' },
];

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState('');
  const [users, setUsers] = useState<StoredUser[]>(DEFAULT_USERS);

  useEffect(() => {
    const savedUsers = localStorage.getItem('housekeeping_users');
    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch (e) {
        console.error('Error loading users:', e);
      }
    }

    const savedUser = localStorage.getItem('housekeeping_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error loading user:', e);
      }
    }
  }, []);

  const handleLogin = (username: string, password: string) => {
    const foundUser = users.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    
    if (foundUser) {
      setUser({ username: foundUser.username, role: foundUser.role });
      setLoginError('');
      localStorage.setItem('housekeeping_user', JSON.stringify({ username: foundUser.username, role: foundUser.role }));
    } else {
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
