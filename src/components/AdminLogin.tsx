import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { FizzyButton } from '@/components/ui/fizzy-button';
import Icon from '@/components/ui/icon';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login === 'hab-agent@mail.ru' && password === '3Dyzaape29938172') {
      onLogin();
    } else {
      setError('Неверный логин или пароль');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 to-charcoal-800 flex items-center justify-center px-6">
      <Card className="max-w-md w-full p-10 bg-white shadow-2xl border-0 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="Lock" size={40} className="text-white" />
        </div>
        
        <h2 className="text-3xl font-playfair font-bold text-charcoal-900 mb-2">
          Вход в систему отчетности
        </h2>
        
        <p className="text-charcoal-600 font-inter mb-8">
          Администратор Premium Apartments
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Логин"
              className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all"
              autoFocus
            />
          </div>
          
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all"
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <FizzyButton 
            type="submit"
            className="w-full"
            icon={<Icon name="LogIn" size={18} />}
          >
            Войти
          </FizzyButton>
        </form>
        
        <p className="text-xs text-charcoal-400 mt-6 font-inter">
          Доступ только для администраторов
        </p>
      </Card>
    </div>
  );
};

export default AdminLogin;