import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FizzyButton } from '@/components/ui/fizzy-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const OwnerLoginPage = () => {
  const [loginField, setLoginField] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/0b8a0b4d-6cf0-4bc5-8a77-6860120e85fe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginField, password, action: 'login' })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('ownerToken', data.token);
        localStorage.setItem('ownerId', data.ownerId);
        toast({ title: 'Добро пожаловать!', description: 'Вход выполнен успешно' });
        
        if (data.apartments && data.apartments.length === 1) {
          navigate(`/owner/${data.apartments[0].apartment_id}`);
        } else {
          navigate('/owner-dashboard');
        }
      } else {
        toast({ 
          title: 'Ошибка входа', 
          description: data.message || 'Неверный email или пароль',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({ 
        title: 'Ошибка', 
        description: 'Не удалось выполнить вход',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Вход для собственников</CardTitle>
          <CardDescription>Введите логин или email, чтобы посмотреть отчеты</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loginField">Логин или Email</Label>
              <Input
                id="loginField"
                type="text"
                placeholder="ivan_ivanov или your@email.com"
                value={loginField}
                onChange={(e) => setLoginField(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <FizzyButton
              type="submit"
              className="w-full"
              disabled={loading}
              icon={<Icon name="LogIn" size={18} />}
            >
              {loading ? 'Вход...' : 'Войти'}
            </FizzyButton>
            <div className="text-center text-sm text-gray-600">
              Нет аккаунта?{' '}
              <button
                type="button"
                onClick={() => navigate('/owner-register')}
                className="text-blue-600 hover:underline"
              >
                Зарегистрироваться
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerLoginPage;