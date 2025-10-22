import { useState } from 'react';
import { FizzyButton } from '@/components/ui/fizzy-button';
import Icon from '@/components/ui/icon';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  error?: string;
}

const LoginForm = ({ onLogin, error }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 flex items-center justify-center px-4 py-8">
      <div className="bg-charcoal-800 rounded-2xl p-6 sm:p-8 border border-gray-700 shadow-2xl max-w-md w-full">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gold-600 rounded-full mb-3 sm:mb-4">
            <Icon name="Lock" size={28} className="text-white sm:w-8 sm:h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-white mb-2">
            Вход в систему
          </h1>
          <p className="text-sm sm:text-base text-gray-400">Таблица управления уборкой</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-300 mb-2">
              Логин
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <Icon name="User" size={20} className="text-gray-500" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3.5 sm:py-4 bg-charcoal-700 border border-gray-600 rounded-lg text-white text-base sm:text-lg focus:outline-none focus:border-gold-500 transition-colors"
                placeholder="Введите логин"
                required
                autoComplete="username"
                inputMode="email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-300 mb-2">
              Пароль
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <Icon name="Lock" size={20} className="text-gray-500" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-12 sm:pr-14 py-3.5 sm:py-4 bg-charcoal-700 border border-gray-600 rounded-lg text-white text-base sm:text-lg focus:outline-none focus:border-gold-500 transition-colors"
                placeholder="Введите пароль"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-500 hover:text-gray-300 active:text-gray-200 touch-manipulation"
              >
                <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={22} />
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 sm:p-4 flex items-center gap-2">
              <Icon name="AlertCircle" size={20} className="text-red-500 flex-shrink-0" />
              <p className="text-red-200 text-sm sm:text-base">{error}</p>
            </div>
          )}

          <FizzyButton
            type="submit"
            className="w-full py-4 sm:py-3 text-base sm:text-lg touch-manipulation"
            icon={<Icon name="LogIn" size={20} />}
          >
            Войти
          </FizzyButton>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;