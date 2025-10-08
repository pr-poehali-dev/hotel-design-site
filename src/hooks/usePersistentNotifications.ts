import { useState, useCallback, useEffect } from 'react';

interface PersistentNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: number;
  userId: string;
  read: boolean;
}

const STORAGE_KEY = 'housekeeping_notifications';
const NOTIFICATION_LIFETIME = 24 * 60 * 60 * 1000;

export const usePersistentNotifications = (userId: string) => {
  const [persistentNotifications, setPersistentNotifications] = useState<PersistentNotification[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const allNotifications: PersistentNotification[] = JSON.parse(stored);
        const now = Date.now();
        const userNotifications = allNotifications.filter(
          n => n.userId === userId && !n.read && (now - n.timestamp) < NOTIFICATION_LIFETIME
        );
        setPersistentNotifications(userNotifications);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  }, [userId]);

  const saveNotification = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error', targetUserId: string) => {
    const notification: PersistentNotification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: Date.now(),
      userId: targetUserId,
      read: false
    };

    const stored = localStorage.getItem(STORAGE_KEY);
    const allNotifications: PersistentNotification[] = stored ? JSON.parse(stored) : [];
    allNotifications.push(notification);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allNotifications));

    if (targetUserId === userId) {
      setPersistentNotifications(prev => [...prev, notification]);
    }
  }, [userId]);

  const markAsRead = useCallback((notificationId: string) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const allNotifications: PersistentNotification[] = JSON.parse(stored);
      const updated = allNotifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setPersistentNotifications(prev => prev.filter(n => n.id !== notificationId));
    }
  }, []);

  return {
    persistentNotifications,
    saveNotification,
    markAsRead
  };
};
