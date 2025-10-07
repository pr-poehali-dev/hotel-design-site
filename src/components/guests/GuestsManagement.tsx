import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const API_URL = 'https://functions.poehali.dev/a0648fb1-e2c4-4c52-86e7-e96230f139d2';

interface Guest {
  id: number;
  email: string;
  name: string;
  phone: string;
  created_at: string;
}

const GuestsManagement = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const { toast } = useToast();

  const [newGuest, setNewGuest] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = async () => {
    setLoading(true);
    toast({
      title: 'Информация',
      description: 'Функция загрузки всех гостей еще не реализована. Используйте форму для создания новых гостей.',
    });
    setLoading(false);
  };

  const handleAddGuest = async () => {
    if (!newGuest.email || !newGuest.password) {
      toast({
        title: 'Ошибка',
        description: 'Email и пароль обязательны',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          email: newGuest.email,
          password: newGuest.password,
          name: newGuest.name,
          phone: newGuest.phone
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Успешно!',
          description: 'Гость создан. Отправьте ему email и пароль для входа.',
        });
        
        setShowAddDialog(false);
        setNewGuest({ email: '', password: '', name: '', phone: '' });
        loadGuests();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось создать гостя',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать гостя. Попробуйте позже.',
        variant: 'destructive',
      });
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewGuest({ ...newGuest, password });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-charcoal-900">
            Управление гостями
          </h2>
          <p className="text-charcoal-600 mt-1">
            Создавайте аккаунты для гостей и управляйте доступом
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-gold-500 hover:bg-gold-600"
        >
          <Icon name="UserPlus" size={18} className="mr-2" />
          Добавить гостя
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Инструкция по созданию гостя</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center font-semibold flex-shrink-0">
              1
            </div>
            <div>
              <p className="font-semibold text-charcoal-900">Создайте аккаунт</p>
              <p className="text-sm text-charcoal-600">
                Нажмите "Добавить гостя", введите email и сгенерируйте пароль
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center font-semibold flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-semibold text-charcoal-900">Скопируйте данные</p>
              <p className="text-sm text-charcoal-600">
                Скопируйте email и пароль — вам нужно отправить их гостю
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center font-semibold flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-semibold text-charcoal-900">Отправьте гостю</p>
              <p className="text-sm text-charcoal-600">
                Отправьте email и пароль гостю (через WhatsApp, email или другим способом)
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-2">
              <Icon name="Info" size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Адрес личного кабинета:</p>
                <code className="bg-white px-2 py-1 rounded border border-blue-300">
                  https://p9apart.ru/guest-login
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-playfair text-2xl">Создать гостя</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="guest@example.com"
                value={newGuest.email}
                onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="password">Пароль *</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type="text"
                  placeholder="Введите или сгенерируйте"
                  value={newGuest.password}
                  onChange={(e) => setNewGuest({ ...newGuest, password: e.target.value })}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generatePassword}
                  title="Сгенерировать пароль"
                >
                  <Icon name="RefreshCw" size={18} />
                </Button>
              </div>
              <p className="text-xs text-charcoal-500 mt-1">
                Скопируйте пароль — вам нужно отправить его гостю
              </p>
            </div>

            <div>
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                type="text"
                placeholder="Иван Иванов"
                value={newGuest.name}
                onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 900 123-45-67"
                value={newGuest.phone}
                onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
              />
            </div>

            {newGuest.password && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-semibold text-green-900 mb-2">
                  Данные для входа:
                </p>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-green-700">Email:</span>{' '}
                    <code className="bg-white px-2 py-1 rounded border border-green-300">
                      {newGuest.email}
                    </code>
                  </p>
                  <p>
                    <span className="text-green-700">Пароль:</span>{' '}
                    <code className="bg-white px-2 py-1 rounded border border-green-300">
                      {newGuest.password}
                    </code>
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Отмена
            </Button>
            <Button
              onClick={handleAddGuest}
              className="bg-gold-500 hover:bg-gold-600"
            >
              Создать гостя
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GuestsManagement;
