import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import LoginForm from '@/components/LoginForm';

interface User {
  id: number;
  username: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

export default function UsersManagementPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', full_name: '' });

  useEffect(() => {
    const authStatus = sessionStorage.getItem('reportsAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (username: string, password: string): boolean => {
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('reportsAuth', 'true');
      fetchUsers();
      return true;
    }
    return false;
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/d27dcc7d-f9e0-4fba-8bcc-90b222d398cb');
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.username || !newUser.password) {
      alert('Заполните логин и пароль');
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/d27dcc7d-f9e0-4fba-8bcc-90b222d398cb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          ...newUser
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setDialogOpen(false);
        setNewUser({ username: '', password: '', full_name: '' });
        fetchUsers();
      } else {
        alert(data.message || 'Ошибка создания пользователя');
      }
    } catch (error) {
      alert('Ошибка при создании пользователя');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Вы уверены, что хотите деактивировать этого пользователя?')) {
      return;
    }

    try {
      await fetch('https://functions.poehali.dev/d27dcc7d-f9e0-4fba-8bcc-90b222d398cb', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });

      fetchUsers();
    } catch (error) {
      alert('Ошибка при удалении пользователя');
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold">Управление пользователями</h1>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Icon name="UserPlus" size={18} />
            Добавить пользователя
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Список пользователей</CardTitle>
            <CardDescription>Пользователи с доступом к отчетам</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{user.full_name || user.username}</h3>
                      <p className="text-sm text-muted-foreground">@{user.username}</p>
                      <p className="text-xs text-muted-foreground">
                        Создан: {new Date(user.created_at).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {user.is_active ? (
                      <span className="text-xs px-3 py-1 bg-green-500/20 text-green-700 rounded-full">
                        Активен
                      </span>
                    ) : (
                      <span className="text-xs px-3 py-1 bg-red-500/20 text-red-700 rounded-full">
                        Неактивен
                      </span>
                    )}
                    {user.is_active && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="gap-2"
                      >
                        <Icon name="UserX" size={16} />
                        Деактивировать
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить нового пользователя</DialogTitle>
            <DialogDescription>
              Создайте учетную запись для доступа к отчетам
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="username">Логин</Label>
              <Input
                id="username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                placeholder="username"
              />
            </div>

            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>

            <div>
              <Label htmlFor="full_name">Полное имя (необязательно)</Label>
              <Input
                id="full_name"
                value={newUser.full_name}
                onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                placeholder="Иван Иванов"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleCreateUser} className="gap-2">
              <Icon name="UserPlus" size={18} />
              Создать
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
