import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import GuestsList, { Guest } from './GuestsList';
import GuestsSearchBar from './GuestsSearchBar';
import AddGuestDialog from './AddGuestDialog';
import ResetPasswordDialog from './ResetPasswordDialog';
import GuestsInstructions from './GuestsInstructions';
import EmptyGuestsState from './EmptyGuestsState';

const API_URL = 'https://functions.poehali.dev/a0648fb1-e2c4-4c52-86e7-e96230f139d2';

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
    phone: '',
    apartment_id: '',
    check_in: '',
    check_out: ''
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

    if (!newGuest.apartment_id || !newGuest.check_in || !newGuest.check_out) {
      toast({
        title: 'Ошибка',
        description: 'Заполните информацию о бронировании',
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
          phone: newGuest.phone,
          apartment_id: newGuest.apartment_id,
          check_in: newGuest.check_in,
          check_out: newGuest.check_out
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Успешно!',
          description: 'Гость и бронирование созданы. Отправьте гостю email и пароль для входа.',
        });
        
        setShowAddDialog(false);
        setNewGuest({ email: '', password: '', name: '', phone: '', apartment_id: '', check_in: '', check_out: '' });
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
        <GuestsSearchBar
          searchQuery={searchQuery}
          sortOrder={sortOrder}
          onSearchChange={setSearchQuery}
          onSortChange={setSortOrder}
        />
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
            <GuestsList
              guests={filteredAndSortedGuests}
              searchQuery={searchQuery}
              onResetPassword={(email) => {
                setResetEmail(email);
                setShowResetDialog(true);
              }}
              onDeleteGuest={handleDeleteGuest}
              onClearSearch={() => setSearchQuery('')}
            />
          </CardContent>
        </Card>
      ) : (
        <EmptyGuestsState onAddGuest={() => setShowAddDialog(true)} />
      )}

      <GuestsInstructions />

      <AddGuestDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        newGuest={newGuest}
        onGuestChange={setNewGuest}
        onGeneratePassword={generatePassword}
        onSubmit={handleAddGuest}
      />

      <ResetPasswordDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        resetEmail={resetEmail}
        resetPassword={resetPassword}
        onEmailChange={setResetEmail}
        onPasswordChange={setResetPassword}
        onGeneratePassword={generateResetPassword}
        onSubmit={handleResetPassword}
      />
    </div>
  );
};

export default GuestsManagement;