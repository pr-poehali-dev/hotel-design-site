import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Owner {
  id: number;
  username: string;
  full_name: string;
  apartment_number: string;
  email: string;
  phone: string;
  is_active: boolean;
}

export default function AdminOwnersPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    apartment_number: '',
    email: '',
    phone: ''
  });

  const loadOwners = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/65d57cf7-a248-416f-87f1-477b145f13c2');
      if (response.ok) {
        const data = await response.json();
        setOwners(data);
      }
    } catch (err) {
      console.error('Failed to load owners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwners();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingOwner) {
        await fetch('https://functions.poehali.dev/65d57cf7-a248-416f-87f1-477b145f13c2', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, id: editingOwner.id })
        });
      } else {
        await fetch('https://functions.poehali.dev/65d57cf7-a248-416f-87f1-477b145f13c2', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      
      setShowModal(false);
      setEditingOwner(null);
      setFormData({ username: '', password: '', full_name: '', apartment_number: '', email: '', phone: '' });
      loadOwners();
    } catch (err) {
      console.error('Failed to save owner:', err);
    }
  };

  const handleEdit = (owner: Owner) => {
    setEditingOwner(owner);
    setFormData({
      username: owner.username,
      password: '',
      full_name: owner.full_name,
      apartment_number: owner.apartment_number,
      email: owner.email,
      phone: owner.phone
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить владельца?')) return;
    
    try {
      await fetch(`https://functions.poehali.dev/65d57cf7-a248-416f-87f1-477b145f13c2?id=${id}`, {
        method: 'DELETE'
      });
      loadOwners();
    } catch (err) {
      console.error('Failed to delete owner:', err);
    }
  };

  const handleToggleActive = async (owner: Owner) => {
    try {
      await fetch('https://functions.poehali.dev/65d57cf7-a248-416f-87f1-477b145f13c2', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: owner.id, is_active: !owner.is_active })
      });
      loadOwners();
    } catch (err) {
      console.error('Failed to toggle active status:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900">
      {/* Header */}
      <div className="bg-charcoal-900 border-b border-gold-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
                <Icon name="Users" size={24} className="text-charcoal-900" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Управление владельцами</h1>
                <p className="text-xs text-gray-400">Администратор</p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingOwner(null);
                setFormData({ username: '', password: '', full_name: '', apartment_number: '', email: '', phone: '' });
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-charcoal-900 rounded-lg font-semibold hover:bg-gold-600 transition-colors"
            >
              <Icon name="Plus" size={20} />
              Добавить владельца
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {owners.length === 0 ? (
          <Card className="p-8 text-center">
            <Icon name="Users" size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Нет владельцев</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {owners.map((owner) => (
              <Card key={owner.id} className={`p-4 ${!owner.is_active ? 'opacity-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-white">{owner.full_name}</h3>
                      {!owner.is_active && (
                        <span className="text-xs bg-red-500/20 text-red-500 px-2 py-1 rounded-full">Неактивен</span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Icon name="User" size={14} />
                        {owner.username}
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Building" size={14} />
                        Апартамент {owner.apartment_number}
                      </div>
                      {owner.email && (
                        <div className="flex items-center gap-2">
                          <Icon name="Mail" size={14} />
                          {owner.email}
                        </div>
                      )}
                      {owner.phone && (
                        <div className="flex items-center gap-2">
                          <Icon name="Phone" size={14} />
                          {owner.phone}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(owner)}
                      className={`p-2 rounded-lg transition-colors ${
                        owner.is_active
                          ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                          : 'bg-gray-500/20 text-gray-500 hover:bg-gray-500/30'
                      }`}
                      title={owner.is_active ? 'Деактивировать' : 'Активировать'}
                    >
                      <Icon name={owner.is_active ? 'Check' : 'X'} size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(owner)}
                      className="p-2 bg-gold-500/20 text-gold-500 rounded-lg hover:bg-gold-500/30 transition-colors"
                      title="Редактировать"
                    >
                      <Icon name="Edit" size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(owner.id)}
                      className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
                      title="Удалить"
                    >
                      <Icon name="Trash2" size={18} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingOwner ? 'Редактировать владельца' : 'Добавить владельца'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Логин</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 bg-charcoal-800 text-white rounded-lg border border-gray-700 focus:border-gold-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Пароль {editingOwner && '(оставьте пустым, если не меняете)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 bg-charcoal-800 text-white rounded-lg border border-gray-700 focus:border-gold-500 focus:outline-none"
                  required={!editingOwner}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">ФИО</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-3 py-2 bg-charcoal-800 text-white rounded-lg border border-gray-700 focus:border-gold-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Номер апартамента</label>
                <input
                  type="text"
                  value={formData.apartment_number}
                  onChange={(e) => setFormData({ ...formData, apartment_number: e.target.value })}
                  className="w-full px-3 py-2 bg-charcoal-800 text-white rounded-lg border border-gray-700 focus:border-gold-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-charcoal-800 text-white rounded-lg border border-gray-700 focus:border-gold-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Телефон</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-charcoal-800 text-white rounded-lg border border-gray-700 focus:border-gold-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingOwner(null);
                  }}
                  className="flex-1 px-4 py-2 bg-charcoal-800 text-white rounded-lg hover:bg-charcoal-700 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gold-500 text-charcoal-900 rounded-lg font-semibold hover:bg-gold-600 transition-colors"
                >
                  {editingOwner ? 'Сохранить' : 'Создать'}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
