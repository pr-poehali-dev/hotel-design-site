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
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'name'>('newest');
  const { toast } = useToast();

  const [newGuest, setNewGuest] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setGuests(data.guests || []);
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось загрузить гостей',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить гостей. Попробуйте позже.',
        variant: 'destructive',
      });
    }
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

  const generateResetPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setResetPassword(password);
  };

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
        
        setShowResetDialog(false);
        setResetEmail('');
        setResetPassword('');
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось сбросить пароль',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сбросить пароль. Попробуйте позже.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteGuest = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этого гостя? Это действие нельзя отменить.')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Успешно!',
          description: 'Гость удалён',
        });
        loadGuests();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось удалить гостя',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить гостя. Попробуйте позже.',
        variant: 'destructive',
      });
    }
  };

  const filteredAndSortedGuests = guests
    .filter((guest) => {
      const query = searchQuery.toLowerCase();
      return (
        guest.email.toLowerCase().includes(query) ||
        guest.name?.toLowerCase().includes(query) ||
        guest.phone?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else {
        return (a.name || '').localeCompare(b.name || '');
      }
    });

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
        <div className="flex gap-3">
          <Button
            onClick={() => setShowResetDialog(true)}
            variant="outline"
            className="border-gold-300 text-gold-700 hover:bg-gold-50"
          >
            <Icon name="KeyRound" size={18} className="mr-2" />
            Сбросить пароль
          </Button>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-gold-500 hover:bg-gold-600"
          >
            <Icon name="UserPlus" size={18} className="mr-2" />
            Добавить гостя
          </Button>
        </div>
      </div>

      {guests.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Icon 
                  name="Search" 
                  size={18} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" 
                />
                <Input
                  placeholder="Поиск по email, имени или телефону..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={sortOrder === 'newest' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortOrder('newest')}
                  className={sortOrder === 'newest' ? 'bg-gold-500 hover:bg-gold-600' : ''}
                >
                  <Icon name="ArrowDownWideNarrow" size={16} className="mr-2" />
                  Новые
                </Button>
                <Button
                  variant={sortOrder === 'oldest' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortOrder('oldest')}
                  className={sortOrder === 'oldest' ? 'bg-gold-500 hover:bg-gold-600' : ''}
                >
                  <Icon name="ArrowUpWideNarrow" size={16} className="mr-2" />
                  Старые
                </Button>
                <Button
                  variant={sortOrder === 'name' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortOrder('name')}
                  className={sortOrder === 'name' ? 'bg-gold-500 hover:bg-gold-600' : ''}
                >
                  <Icon name="SortAsc" size={16} className="mr-2" />
                  Имя
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
        </div>
      ) : guests.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>
              Список гостей ({filteredAndSortedGuests.length}
              {filteredAndSortedGuests.length !== guests.length && ` из ${guests.length}`})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredAndSortedGuests.length === 0 ? (
              <div className="text-center py-8">
                <Icon name="SearchX" size={48} className="mx-auto text-charcoal-400 mb-3" />
                <p className="text-charcoal-600">
                  Ничего не найдено по запросу "{searchQuery}"
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="mt-3"
                >
                  Очистить поиск
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAndSortedGuests.map((guest) => (
                <div
                  key={guest.id}
                  className="flex items-center justify-between p-4 bg-white border border-charcoal-200 rounded-lg hover:border-gold-400 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center">
                        <Icon name="User" size={20} className="text-gold-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-charcoal-900">
                          {guest.name || 'Без имени'}
                        </p>
                        <p className="text-sm text-charcoal-600">{guest.email}</p>
                        {guest.phone && (
                          <p className="text-xs text-charcoal-500">{guest.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-charcoal-500">
                      {new Date(guest.created_at).toLocaleDateString('ru-RU')}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setResetEmail(guest.email);
                        setShowResetDialog(true);
                      }}
                      className="text-gold-600 hover:text-gold-700 hover:bg-gold-50"
                    >
                      <Icon name="KeyRound" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteGuest(guest.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-2 border-charcoal-300">
          <CardContent className="py-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gold-100 mx-auto mb-4 flex items-center justify-center">
                <Icon name="Users" size={32} className="text-gold-600" />
              </div>
              <h3 className="text-lg font-semibold text-charcoal-900 mb-2">
                Нет гостей
              </h3>
              <p className="text-charcoal-600 mb-4">
                Создайте первого гостя, чтобы начать работу
              </p>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-gold-500 hover:bg-gold-600"
              >
                <Icon name="UserPlus" size={18} className="mr-2" />
                Добавить гостя
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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

      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-playfair text-2xl">Сбросить пароль</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="reset-email">Email гостя *</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="guest@example.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
              <p className="text-xs text-charcoal-500 mt-1">
                Введите email гостя, которому нужно сбросить пароль
              </p>
            </div>

            <div>
              <Label htmlFor="reset-password">Новый пароль *</Label>
              <div className="flex gap-2">
                <Input
                  id="reset-password"
                  type="text"
                  placeholder="Введите или сгенерируйте"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateResetPassword}
                  title="Сгенерировать пароль"
                >
                  <Icon name="RefreshCw" size={18} />
                </Button>
              </div>
              <p className="text-xs text-charcoal-500 mt-1">
                Скопируйте новый пароль и отправьте его гостю
              </p>
            </div>

            {resetPassword && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex gap-2 mb-2">
                  <Icon name="AlertTriangle" size={18} className="text-amber-600 flex-shrink-0" />
                  <p className="text-sm font-semibold text-amber-900">
                    Новый пароль для гостя:
                  </p>
                </div>
                <code className="block bg-white px-3 py-2 rounded border border-amber-300 text-sm">
                  {resetPassword}
                </code>
                <p className="text-xs text-amber-700 mt-2">
                  Скопируйте и отправьте этот пароль гостю
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              Отмена
            </Button>
            <Button
              onClick={handleResetPassword}
              className="bg-gold-500 hover:bg-gold-600"
            >
              <Icon name="KeyRound" size={18} className="mr-2" />
              Сбросить пароль
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GuestsManagement;