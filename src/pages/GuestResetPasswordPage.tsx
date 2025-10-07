import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const API_URL = 'https://functions.poehali.dev/00f1c03b-e81c-4016-b7a3-2d06f576b4ab';

const GuestResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast({
        title: 'Ошибка',
        description: 'Токен восстановления не найден',
        variant: 'destructive',
      });
      navigate('/guest-forgot-password');
    }
  }, [token, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Ошибка',
        description: 'Пароли не совпадают',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Ошибка',
        description: 'Пароль должен быть минимум 6 символов',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset_password',
          token,
          new_password: password
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        toast({
          title: 'Успешно!',
          description: 'Пароль изменён. Войдите с новым паролем',
        });
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось изменить пароль',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить запрос. Попробуйте позже.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a 
            href="/" 
            className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer mb-4"
          >
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-3xl font-playfair font-bold text-white">P9</span>
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold-300 rounded-full opacity-80"></div>
            </div>
          </a>
          <h1 className="text-3xl font-playfair font-bold text-charcoal-900 mb-2">
            Новый пароль
          </h1>
          <p className="text-gray-600">Придумайте новый пароль для вашего аккаунта</p>
        </div>

        <Card className="border-t-4 border-t-gold-500 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-playfair">Сброс пароля</CardTitle>
            <CardDescription>Введите новый пароль</CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4">
                <Alert className="bg-green-50 border-green-200">
                  <Icon name="CheckCircle" className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Пароль успешно изменён!</strong>
                    <p className="mt-2">
                      Теперь вы можете войти в личный кабинет с новым паролем.
                    </p>
                  </AlertDescription>
                </Alert>

                <Button
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700"
                  onClick={() => navigate('/guest-login')}
                >
                  <Icon name="LogIn" size={18} className="mr-2" />
                  Войти в личный кабинет
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Новый пароль</Label>
                  <div className="relative">
                    <Icon 
                      name="Lock" 
                      size={18} 
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Минимум 6 символов"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                  <div className="relative">
                    <Icon 
                      name="Lock" 
                      size={18} 
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Повторите пароль"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Icon name="Save" size={18} className="mr-2" />
                      Сохранить новый пароль
                    </>
                  )}
                </Button>

                <div className="text-center pt-4 border-t">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => navigate('/guest-login')}
                  >
                    <Icon name="ArrowLeft" size={18} className="mr-2" />
                    Вернуться к входу
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GuestResetPasswordPage;
