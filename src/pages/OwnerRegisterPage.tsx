import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FizzyButton } from '@/components/ui/fizzy-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const OwnerRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({ 
        title: 'Ошибка', 
        description: 'Пароли не совпадают',
        variant: 'destructive'
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({ 
        title: 'Ошибка', 
        description: 'Пароль должен быть не менее 6 символов',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/0b8a0b4d-6cf0-4bc5-8a77-6860120e85fe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          action: 'register' 
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({ 
          title: 'Регистрация завершена!', 
          description: 'Теперь вы можете войти в систему' 
        });
        navigate('/owner-login');
      } else {
        toast({ 
          title: 'Ошибка регистрации', 
          description: data.message || 'Не удалось создать аккаунт',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({ 
        title: 'Ошибка', 
        description: 'Не удалось выполнить регистрацию',
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
          <CardTitle className="text-2xl font-bold">Регистрация собственника</CardTitle>
          <CardDescription>Создайте аккаунт для доступа к отчетам</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                type="text"
                placeholder="Иван Иванов"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Минимум 6 символов"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Повторите пароль"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                required
              />
            </div>
            <FizzyButton
              type="submit"
              className="w-full"
              disabled={loading}
              icon={<Icon name="UserPlus" size={18} />}
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </FizzyButton>
            <div className="text-center text-sm text-gray-600">
              Уже есть аккаунт?{' '}
              <button
                type="button"
                onClick={() => navigate('/owner-login')}
                className="text-blue-600 hover:underline"
              >
                Войти
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerRegisterPage;