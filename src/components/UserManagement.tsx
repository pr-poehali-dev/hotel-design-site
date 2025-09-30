import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';

interface User {
  id: number;
  username: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string | null;
}

interface UserManagementProps {
  adminToken: string;
}

export default function UserManagement({ adminToken }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    role: 'viewer',
    is_active: true
  });

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/cefd32f3-6db2-456a-bd56-283c41785612', {
        method: 'GET',
        headers: {
          'X-Admin-Token': adminToken
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки пользователей');
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [adminToken]);

  const handleCreateUser = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      password: '',
      full_name: '',
      role: 'viewer',
      is_active: true
    });
    setDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '',
      full_name: user.full_name,
      role: user.role,
      is_active: user.is_active
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const url = 'https://functions.poehali.dev/cefd32f3-6db2-456a-bd56-283c41785612';
      
      if (editingUser) {
        const updateData: any = { id: editingUser.id };
        if (formData.password) updateData.password = formData.password;
        if (formData.full_name !== editingUser.full_name) updateData.full_name = formData.full_name;
        if (formData.role !== editingUser.role) updateData.role = formData.role;
        if (formData.is_active !== editingUser.is_active) updateData.is_active = formData.is_active;

        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Token': adminToken
          },
          body: JSON.stringify(updateData)
        });

        if (!response.ok) {
          throw new Error('Ошибка обновления пользователя');
        }
      } else {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Token': adminToken
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
            full_name: formData.full_name,
            role: formData.role
          })
        });

        if (!response.ok) {
          throw new Error('Ошибка создания пользователя');
        }
      }

      setDialogOpen(false);
      fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка сохранения');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return;
    }

    try {
      const response = await fetch(
        `https://functions.poehali.dev/cefd32f3-6db2-456a-bd56-283c41785612?id=${userId}`,
        {
          method: 'DELETE',
          headers: {
            'X-Admin-Token': adminToken
          }
        }
      );

      if (!response.ok) {
        throw new Error('Ошибка удаления пользователя');
      }

      fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка удаления');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">Ошибка: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление пользователями</h2>
        <Button onClick={handleCreateUser} className="gap-2">
          <Icon name="UserPlus" size={18} />
          Добавить пользователя
        </Button>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {user.full_name}
                    {user.role === 'admin' && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                        Администратор
                      </span>
                    )}
                    {!user.is_active && (
                      <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded">
                        Неактивен
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>@{user.username}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditUser(user)}
                    className="gap-2"
                  >
                    <Icon name="Edit" size={16} />
                    Редактировать
                  </Button>
                  {user.role !== 'admin' && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteUser(user.id)}
                      className="gap-2"
                    >
                      <Icon name="Trash2" size={16} />
                      Удалить
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Редактировать пользователя' : 'Новый пользователь'}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? 'Измените данные пользователя. Оставьте пароль пустым, чтобы не менять его.'
                : 'Заполните данные для создания нового пользователя.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Логин</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={!!editingUser}
                placeholder="Введите логин"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Пароль {editingUser && '(оставьте пустым, если не хотите менять)'}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Введите пароль"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Полное имя</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Введите полное имя"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Роль</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Просмотр</SelectItem>
                  <SelectItem value="admin">Администратор</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {editingUser && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label htmlFor="is_active">Активный пользователь</Label>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSubmit}>
              {editingUser ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
