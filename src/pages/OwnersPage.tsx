import { useState, useEffect } from 'react';
import AdminLogin from '@/components/AdminLogin';
import OwnersHeader from '@/components/owners/OwnersHeader';
import InvestorSection from '@/components/owners/InvestorSection';
import OwnerSection from '@/components/owners/OwnerSection';

const AUTH_KEY = 'premium_apartments_admin_auth';

interface Owner {
  apartmentId: string;
  ownerEmail: string;
  ownerName: string;
  commissionRate: number;
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
  const [formData, setFormData] = useState({ apartmentId: '', ownerEmail: '', ownerName: '', commissionRate: 20, username: '', password: '' });
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
    setFormData({ apartmentId: owner.apartmentId, ownerEmail: owner.ownerEmail, ownerName: owner.ownerName, commissionRate: owner.commissionRate || 20, username: '', password: '' });
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingId(null);
    setFormData({ apartmentId: '', ownerEmail: '', ownerName: '', commissionRate: 20, username: '', password: '' });
  };

  const handleSave = async () => {
    if (editingId) {
      await handleUpdate();
    } else {
      await handleCreate();
    }
  };

  const handleCreate = async () => {
    if (!formData.apartmentId || !formData.ownerEmail || !formData.ownerName || !formData.username || !formData.password) {
      alert('Заполните все поля');
      return;
    }

    setLoading(true);
    try {
      const ownerResponse = await fetch('https://functions.poehali.dev/03cef8fb-0be9-49db-bf4a-2867e6e483e5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apartmentId: formData.apartmentId,
          ownerEmail: formData.ownerEmail,
          ownerName: formData.ownerName,
          commissionRate: formData.commissionRate,
        }),
      });

      if (!ownerResponse.ok) {
        alert('Ошибка при сохранении данных собственника');
        return;
      }

      const userResponse = await fetch('https://functions.poehali.dev/65d57cf7-a248-416f-87f1-477b145f13c2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          apartment_number: formData.apartmentId,
          full_name: formData.ownerName,
          email: formData.ownerEmail,
          phone: ''
        }),
      });

      if (!userResponse.ok) {
        alert('Ошибка при создании логина/пароля. Собственник создан, но доступ не предоставлен.');
      }

      await loadOwners();
      await loadOwnerUsers();
      setEditingId(null);
      setIsAddingNew(false);
      setFormData({ apartmentId: '', ownerEmail: '', ownerName: '', commissionRate: 20, username: '', password: '' });
      alert('Собственник успешно добавлен! Логин и пароль созданы.');
    } catch (error) {
      console.error('Failed to save owner:', error);
      alert('Ошибка при сохранении данных');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData.apartmentId || !formData.ownerEmail || !formData.ownerName) {
      alert('Заполните все поля');
      return;
    }

    setLoading(true);
    try {
      const ownerResponse = await fetch('https://functions.poehali.dev/03cef8fb-0be9-49db-bf4a-2867e6e483e5', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apartmentId: formData.apartmentId,
          ownerEmail: formData.ownerEmail,
          ownerName: formData.ownerName,
          commissionRate: formData.commissionRate,
        }),
      });

      if (!ownerResponse.ok) {
        alert('Ошибка при обновлении данных собственника');
        return;
      }

      await loadOwners();
      setEditingId(null);
      setFormData({ apartmentId: '', ownerEmail: '', ownerName: '', commissionRate: 20, username: '', password: '' });
      alert('Данные собственника обновлены!');
    } catch (error) {
      console.error('Failed to update owner:', error);
      alert('Ошибка при обновлении данных');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAddingNew(false);
    setFormData({ apartmentId: '', ownerEmail: '', ownerName: '', commissionRate: 20, username: '', password: '' });
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

  const handleDeleteAurora = async () => {
    if (!confirm('Удалить апартамент "2х комнатный Aurora" и все связанные данные?')) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/d82aecdf-ee68-43a2-be23-5b95a94fc5bf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`Успешно удалено:\n- Апартамент: ${result.deleted.apartment}\n- Записей календаря: ${result.deleted.calendar_records}\n- Записей уборок: ${result.deleted.cleaning_history}`);
        await loadOwners();
      } else {
        alert('Ошибка при удалении');
      }
    } catch (error) {
      console.error('Failed to delete Aurora:', error);
      alert('Ошибка при удалении');
    } finally {
      setLoading(false);
    }
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
        <OwnersHeader
          showInvestorSection={showInvestorSection}
          isAddingNew={isAddingNew}
          onToggleInvestorSection={() => setShowInvestorSection(!showInvestorSection)}
          onAddNew={handleAddNew}
          onLogout={handleLogout}
        />

        <div className="mb-6 bg-red-500/20 border border-red-500 rounded-lg p-4">
          <p className="text-white mb-3">Временная кнопка для удаления апартамента Aurora</p>
          <button
            onClick={handleDeleteAurora}
            disabled={loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? 'Удаление...' : 'Удалить Aurora'}
          </button>
        </div>

        {showInvestorSection && (
          <InvestorSection
            ownerUsers={ownerUsers}
            isAddingInvestor={isAddingInvestor}
            investorForm={investorForm}
            loading={loading}
            onAddInvestor={handleAddInvestor}
            onSaveInvestor={handleSaveInvestor}
            onCancelInvestor={() => setIsAddingInvestor(false)}
            onDeleteInvestor={handleDeleteInvestor}
            onToggleStatus={toggleInvestorStatus}
            onFormChange={setInvestorForm}
          />
        )}

        <OwnerSection
          owners={owners}
          isAddingNew={isAddingNew}
          editingId={editingId}
          formData={formData}
          loading={loading}
          onSave={handleSave}
          onCancel={handleCancel}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCopyLink={copyLink}
          onFormChange={setFormData}
        />
      </div>
    </div>
  );
}