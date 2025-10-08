import { useState } from 'react';

const API_URL = 'https://functions.poehali.dev/a0648fb1-e2c4-4c52-86e7-e96230f139d2';

export const usePasswordReset = (toast: any) => {
  const [resetEmail, setResetEmail] = useState('');
  const [resetPassword, setResetPassword] = useState('');

  const handleResetPassword = async () => {
    if (!resetEmail || !resetPassword) {
      toast({
        title: 'Ошибка',
        description: 'Введите email и новый пароль',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset_password',
          email: resetEmail,
          new_password: resetPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Пароль изменён!',
          description: 'Отправьте новый пароль гостю для входа.',
        });
        
        setResetEmail('');
        setResetPassword('');
        return true;
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось сбросить пароль',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сбросить пароль. Попробуйте позже.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const generateResetPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setResetPassword(password);
  };

  return {
    resetEmail,
    setResetEmail,
    resetPassword,
    setResetPassword,
    handleResetPassword,
    generateResetPassword
  };
};
