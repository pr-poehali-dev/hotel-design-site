import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const API_URL = 'https://functions.poehali.dev/00f1c03b-e81c-4016-b7a3-2d06f576b4ab';

const GuestForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request_reset',
          email
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSent(true);
        toast({
          title: 'Письмо отправлено!',
          description: 'Проверьте свою почту для восстановления пароля',
        });
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось отправить письмо',
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
            Восстановление пароля
          </h1>
          <p className="text-gray-600">Введите email для получения инструкций</p>
        </div>

        <Card className="border-t-4 border-t-gold-500 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-playfair">Забыли пароль?</CardTitle>
            <CardDescription>Мы отправим инструкцию на вашу почту</CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="space-y-4">
                <Alert className="bg-green-50 border-green-200">
                  <Icon name="CheckCircle" className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Письмо отправлено!</strong>
                    <p className="mt-2">
                      Проверьте свою почту <strong>{email}</strong> и перейдите по ссылке для восстановления пароля.
                    </p>
                    <p className="mt-2 text-sm">
                      Ссылка действительна в течение 1 часа.
                    </p>
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/guest-login')}
                  >
                    <Icon name="ArrowLeft" size={18} className="mr-2" />
                    Вернуться к входу
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setSent(false)}
                  >
                    Отправить повторно
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Icon 
                      name="Mail" 
                      size={18} 
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    На этот адрес будет отправлена ссылка для сброса пароля
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Icon name="Send" size={18} className="mr-2" />
                      Отправить инструкцию
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

export default GuestForgotPasswordPage;
