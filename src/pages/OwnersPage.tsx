import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import AdminLogin from '@/components/AdminLogin';

const AUTH_KEY = 'premium_apartments_admin_auth';

interface Owner {
  apartmentId: string;
  ownerEmail: string;
  ownerName: string;
}

interface OwnerUser {
  id: number;
  username: string;
  apartment_number: string;
  full_name: string;
  email: string;
  phone: string;
  is_active: boolean;
}

export default function OwnersPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });

  const [owners, setOwners] = useState<Owner[]>([]);
  const [ownerUsers, setOwnerUsers] = useState<OwnerUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ apartmentId: '', ownerEmail: '', ownerName: '' });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showInvestorSection, setShowInvestorSection] = useState(false);
  const [investorForm, setInvestorForm] = useState({
    username: '',
    password: '',
    apartment_number: '',
    full_name: '',
    email: '',
    phone: ''
  });
  const [isAddingInvestor, setIsAddingInvestor] = useState(false);

  const loadOwners = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/03cef8fb-0be9-49db-bf4a-2867e6e483e5');
      if (response.ok) {
        const data = await response.json();
        setOwners(data);
      }
    } catch (error) {
      console.error('Failed to load owners:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOwnerUsers = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/65d57cf7-a248-416f-87f1-477b145f13c2');
      if (response.ok) {
        const data = await response.json();
        setOwnerUsers(data);
      }
    } catch (error) {
      console.error('Failed to load owner users:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadOwners();
      loadOwnerUsers();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_KEY, 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
  };

  const handleEdit = (owner: Owner) => {
    setEditingId(owner.apartmentId);
    setIsAddingNew(false);
    setFormData({ apartmentId: owner.apartmentId, ownerEmail: owner.ownerEmail, ownerName: owner.ownerName });
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingId(null);
    setFormData({ apartmentId: '', ownerEmail: '', ownerName: '' });
  };

  const handleSave = async () => {
    if (!formData.apartmentId || !formData.ownerEmail || !formData.ownerName) {
      alert('Заполните все поля');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/03cef8fb-0be9-49db-bf4a-2867e6e483e5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apartmentId: formData.apartmentId,
          ownerEmail: formData.ownerEmail,
          ownerName: formData.ownerName,
        }),
      });

      if (response.ok) {
        await loadOwners();
        setEditingId(null);
        setIsAddingNew(false);
        setFormData({ apartmentId: '', ownerEmail: '', ownerName: '' });
      } else {
        alert('Ошибка при сохранении данных');
      }
    } catch (error) {
      console.error('Failed to save owner:', error);
      alert('Ошибка при сохранении данных');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAddingNew(false);
    setFormData({ apartmentId: '', ownerEmail: '', ownerName: '' });
  };

  const handleDelete = async (apartmentId: string) => {
    if (!confirm(`Удалить собственника апартамента ${apartmentId}?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://functions.poehali.dev/03cef8fb-0be9-49db-bf4a-2867e6e483e5?apartment_id=${apartmentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadOwners();
      } else {
        alert('Ошибка при удалении данных');
      }
    } catch (error) {
      console.error('Failed to delete owner:', error);
      alert('Ошибка при удалении данных');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = (apartmentId: string) => {
    const link = `${window.location.origin}/owner/${apartmentId}`;
    navigator.clipboard.writeText(link);
    alert('Ссылка скопирована!');
  };

  const handleAddInvestor = () => {
    setIsAddingInvestor(true);
    setInvestorForm({
      username: '',
      password: '',
      apartment_number: '',
      full_name: '',
      email: '',
      phone: ''
    });
  };

  const handleSaveInvestor = async () => {
    if (!investorForm.username || !investorForm.password || !investorForm.full_name) {
      alert('Заполните обязательные поля: логин, пароль, ФИО');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/65d57cf7-a248-416f-87f1-477b145f13c2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(investorForm)
      });

      if (response.ok) {
        await loadOwnerUsers();
        setIsAddingInvestor(false);
        setInvestorForm({
          username: '',
          password: '',
          apartment_number: '',
          full_name: '',
          email: '',
          phone: ''
        });
        alert('Инвестор успешно добавлен!');
      } else {
        const error = await response.json();
        alert(`Ошибка: ${error.error || 'Не удалось создать инвестора'}`);
      }
    } catch (error) {
      console.error('Failed to save investor:', error);
      alert('Ошибка при сохранении данных');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvestor = async (id: number) => {
    if (!confirm('Удалить доступ инвестора?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://functions.poehali.dev/65d57cf7-a248-416f-87f1-477b145f13c2?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadOwnerUsers();
        alert('Инвестор удалён');
      } else {
        alert('Ошибка при удалении');
      }
    } catch (error) {
      console.error('Failed to delete investor:', error);
      alert('Ошибка при удалении');
    } finally {
      setLoading(false);
    }
  };

  const toggleInvestorStatus = async (id: number, currentStatus: boolean) => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/65d57cf7-a248-416f-87f1-477b145f13c2', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: !currentStatus })
      });

      if (response.ok) {
        await loadOwnerUsers();
      } else {
        alert('Ошибка при изменении статуса');
      }
    } catch (error) {
      console.error('Failed to toggle status:', error);
      alert('Ошибка при изменении статуса');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Управление собственниками</h1>
            <p className="text-slate-300">Добавляйте собственников и привязывайте их к апартаментам</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowInvestorSection(!showInvestorSection)}
              variant={showInvestorSection ? "default" : "outline"}
            >
              <Icon name="Users" size={20} />
              {showInvestorSection ? 'Скрыть инвесторов' : 'Инвесторы'}
            </Button>
            <Button onClick={handleAddNew} disabled={isAddingNew}>
              <Icon name="Plus" size={20} />
              Добавить собственника
            </Button>
            <Button onClick={handleLogout} variant="outline">
              <Icon name="LogOut" size={20} />
              Выйти
            </Button>
          </div>
        </div>

        {showInvestorSection && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Доступы инвесторов</h2>
              <Button onClick={handleAddInvestor} disabled={isAddingInvestor}>
                <Icon name="UserPlus" size={20} />
                Создать доступ
              </Button>
            </div>

            {isAddingInvestor && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4 space-y-3">
                <h3 className="text-xl font-semibold text-white">Новый инвестор</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Логин *</label>
                    <Input
                      value={investorForm.username}
                      onChange={(e) => setInvestorForm({ ...investorForm, username: e.target.value })}
                      placeholder="investor1"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Пароль *</label>
                    <Input
                      type="password"
                      value={investorForm.password}
                      onChange={(e) => setInvestorForm({ ...investorForm, password: e.target.value })}
                      placeholder="••••••••"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">ФИО *</label>
                    <Input
                      value={investorForm.full_name}
                      onChange={(e) => setInvestorForm({ ...investorForm, full_name: e.target.value })}
                      placeholder="Иван Иванов"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Номер апартамента</label>
                    <Input
                      value={investorForm.apartment_number}
                      onChange={(e) => setInvestorForm({ ...investorForm, apartment_number: e.target.value })}
                      placeholder="2019"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Email</label>
                    <Input
                      value={investorForm.email}
                      onChange={(e) => setInvestorForm({ ...investorForm, email: e.target.value })}
                      placeholder="investor@example.com"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Телефон</label>
                    <Input
                      value={investorForm.phone}
                      onChange={(e) => setInvestorForm({ ...investorForm, phone: e.target.value })}
                      placeholder="+7 999 123 45 67"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveInvestor} disabled={loading}>
                    <Icon name="Check" size={16} />
                    Создать
                  </Button>
                  <Button onClick={() => setIsAddingInvestor(false)} variant="outline">
                    <Icon name="X" size={16} />
                    Отмена
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {ownerUsers.map((user) => (
                <div key={user.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-white">{user.full_name}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.is_active 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {user.is_active ? 'Активен' : 'Отключён'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                        <div><span className="text-slate-400">Логин:</span> {user.username}</div>
                        <div><span className="text-slate-400">Апартамент:</span> {user.apartment_number || '—'}</div>
                        <div><span className="text-slate-400">Email:</span> {user.email || '—'}</div>
                        <div><span className="text-slate-400">Телефон:</span> {user.phone || '—'}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => toggleInvestorStatus(user.id, user.is_active)}
                        variant="outline"
                        size="sm"
                      >
                        <Icon name={user.is_active ? "UserX" : "UserCheck"} size={16} />
                      </Button>
                      <Button
                        onClick={() => handleDeleteInvestor(user.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
          <div className="space-y-4">
            {isAddingNew && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                <h3 className="text-xl font-semibold text-white">
                  Новый собственник
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">
                      ID апартамента
                    </label>
                    <Input
                      value={formData.apartmentId}
                      onChange={(e) =>
                        setFormData({ ...formData, apartmentId: e.target.value })
                      }
                      placeholder="2019"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">
                      Имя собственника
                    </label>
                    <Input
                      value={formData.ownerName}
                      onChange={(e) =>
                        setFormData({ ...formData, ownerName: e.target.value })
                      }
                      placeholder="Иван Иванов"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Email</label>
                    <Input
                      value={formData.ownerEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, ownerEmail: e.target.value })
                      }
                      placeholder="owner@example.com"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={loading}>
                      <Icon name="Check" size={16} />
                      Сохранить
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      <Icon name="X" size={16} />
                      Отмена
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {owners.map((owner) => {
              const isEditing = editingId === owner.apartmentId;

              return (
                <div
                  key={owner.apartmentId}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">
                      Апартамент {owner.apartmentId}
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyLink(owner.apartmentId)}
                        variant="outline"
                        size="sm"
                      >
                        <Icon name="Link" size={16} />
                        Скопировать ссылку
                      </Button>
                      <Button
                        onClick={() => handleDelete(owner.apartmentId)}
                        variant="outline"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-slate-300 mb-1 block">
                          ID апартамента
                        </label>
                        <Input
                          value={formData.apartmentId}
                          onChange={(e) =>
                            setFormData({ ...formData, apartmentId: e.target.value })
                          }
                          placeholder="2019"
                          className="bg-white/10 border-white/20 text-white"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-300 mb-1 block">
                          Имя собственника
                        </label>
                        <Input
                          value={formData.ownerName}
                          onChange={(e) =>
                            setFormData({ ...formData, ownerName: e.target.value })
                          }
                          placeholder="Иван Иванов"
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-300 mb-1 block">Email</label>
                        <Input
                          value={formData.ownerEmail}
                          onChange={(e) =>
                            setFormData({ ...formData, ownerEmail: e.target.value })
                          }
                          placeholder="owner@example.com"
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSave} disabled={loading}>
                          <Icon name="Check" size={16} />
                          Сохранить
                        </Button>
                        <Button onClick={handleCancel} variant="outline">
                          <Icon name="X" size={16} />
                          Отмена
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-slate-300">
                        <span className="text-slate-400">Имя:</span> {owner.ownerName}
                      </div>
                      <div className="text-slate-300">
                        <span className="text-slate-400">Email:</span> {owner.ownerEmail}
                      </div>
                      <Button onClick={() => handleEdit(owner)} variant="outline" size="sm">
                        <Icon name="Edit" size={16} />
                        Изменить
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}