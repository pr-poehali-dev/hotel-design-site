import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const GuestLoginPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/c69650aa-9810-4925-a291-4c97eb656645', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('guestAuthenticated', 'true');
        localStorage.setItem('guestId', data.guest.id);
        localStorage.setItem('guestName', data.guest.name);
        localStorage.setItem('guestEmail', data.guest.email);
        localStorage.setItem('guestPhone', data.guest.phone);
        localStorage.setItem('guestIsVip', data.guest.is_vip);
        
        toast({
          title: 'Успешный вход',
          description: `Добро пожаловать, ${data.guest.name}!`,
        });

        setTimeout(() => {
          navigate('/guest-dashboard');
        }, 500);
      } else {
        toast({
          variant: 'destructive',
          title: 'Ошибка входа',
          description: data.message || 'Неверный логин или пароль',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось войти в систему',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
              <Icon name="User" size={32} className="text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-playfair">Личный кабинет гостя</CardTitle>
          <CardDescription>
            Введите логин и пароль для доступа
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login">Логин</Label>
              <div className="relative">
                <Icon name="User" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  id="login"
                  type="text"
                  placeholder="Введите логин"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <div className="relative">
                <Icon name="Lock" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                  Вход...
                </>
              ) : (
                <>
                  <Icon name="LogIn" size={18} className="mr-2" />
                  Войти
                </>
              )}
            </Button>

            <div className="text-center mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                <Icon name="ArrowLeft" size={16} className="mr-1" />
                Вернуться на главную
              </Button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              <Icon name="Info" size={14} className="inline mr-1" />
              Логин и пароль выдаются при бронировании
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestLoginPage;