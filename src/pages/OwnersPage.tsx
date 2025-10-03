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

export default function OwnersPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });

  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ apartmentId: '', ownerEmail: '', ownerName: '' });
  const [isAddingNew, setIsAddingNew] = useState(false);

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

  useEffect(() => {
    if (isAuthenticated) {
      loadOwners();
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