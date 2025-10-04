import { useState } from 'react';
import { FizzyButton } from '@/components/ui/fizzy-button';
import Icon from '@/components/ui/icon';

interface User {
  username: string;
  password: string;
  role: 'admin' | 'housekeeper';
}

interface UserManagementProps {
  users: User[];
  onAddUser: (user: User) => void;
  onDeleteUser: (username: string) => void;
  onUpdateUser: (oldUsername: string, user: User) => void;
}

const UserManagement = ({ users, onAddUser, onDeleteUser, onUpdateUser }: UserManagementProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'housekeeper' as const });
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editData, setEditData] = useState({ username: '', password: '', role: 'housekeeper' as const });
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  const handleAddUser = () => {
    if (!newUser.username.trim()) {
      alert('Введите логин пользователя');
      return;
    }
    if (!newUser.password.trim()) {
      alert('Введите пароль');
      return;
    }
    if (users.some(u => u.username.toLowerCase() === newUser.username.toLowerCase())) {
      alert('Пользователь с таким логином уже существует');
      return;
    }

    onAddUser({
      username: newUser.username.trim(),
      password: newUser.password.trim(),
      role: newUser.role
    });

    setNewUser({ username: '', password: '', role: 'housekeeper' });
  };

  const startEdit = (user: User) => {
    setEditingUser(user.username);
    setEditData({ username: user.username, password: user.password, role: user.role });
  };

  const saveEdit = (oldUsername: string) => {
    if (!editData.username.trim()) {
      alert('Введите логин пользователя');
      return;
    }
    if (!editData.password.trim()) {
      alert('Введите пароль');
      return;
    }

    onUpdateUser(oldUsername, {
      username: editData.username.trim(),
      password: editData.password.trim(),
      role: editData.role
    });

    setEditingUser(null);
  };

  const cancelEdit = () => {
    setEditingUser(null);
  };

  return (
    <div className="mb-6">
      <FizzyButton
        onClick={() => setIsOpen(!isOpen)}
        icon={<Icon name="Users" size={20} />}
        variant="secondary"
      >
        {isOpen ? 'Скрыть управление пользователями' : 'Управление пользователями'}
      </FizzyButton>

      {isOpen && (
        <div className="mt-4 bg-charcoal-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Управление пользователями</h3>

          <div className="mb-6 bg-charcoal-700 rounded-lg p-4 border border-gray-600">
            <h4 className="text-lg font-semibold text-white mb-3">Добавить нового пользователя</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                placeholder="Логин"
                className="px-4 py-2 bg-charcoal-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gold-500"
              />
              <input
                type="text"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Пароль"
                className="px-4 py-2 bg-charcoal-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gold-500"
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'housekeeper' })}
                className="px-4 py-2 bg-charcoal-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gold-500"
              >
                <option value="housekeeper">Горничная</option>
                <option value="admin">Администратор</option>
              </select>
              <FizzyButton
                onClick={handleAddUser}
                icon={<Icon name="Plus" size={20} />}
              >
                Добавить
              </FizzyButton>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-semibold text-white mb-3">Список пользователей ({users.length})</h4>
            {users.map((user) => (
              <div
                key={user.username}
                className="bg-charcoal-700 p-4 rounded-lg border border-gray-600"
              >
                {editingUser === user.username ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                    <input
                      type="text"
                      value={editData.username}
                      onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                      className="px-3 py-2 bg-charcoal-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gold-500"
                      placeholder="Логин"
                    />
                    <input
                      type="text"
                      value={editData.password}
                      onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                      className="px-3 py-2 bg-charcoal-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gold-500"
                      placeholder="Пароль"
                    />
                    <select
                      value={editData.role}
                      onChange={(e) => setEditData({ ...editData, role: e.target.value as 'admin' | 'housekeeper' })}
                      className="px-3 py-2 bg-charcoal-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gold-500"
                    >
                      <option value="housekeeper">Горничная</option>
                      <option value="admin">Администратор</option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(user.username)}
                        className="flex-1 p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                        title="Сохранить"
                      >
                        <Icon name="Check" size={16} className="inline" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        title="Отмена"
                      >
                        <Icon name="X" size={16} className="inline" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Логин</p>
                        <p className="text-white font-semibold flex items-center gap-2">
                          <Icon name="User" size={16} className="text-gray-400" />
                          {user.username}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Пароль</p>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-mono">
                            {showPassword[user.username] ? user.password : '••••••••'}
                          </p>
                          <button
                            onClick={() => setShowPassword({ ...showPassword, [user.username]: !showPassword[user.username] })}
                            className="text-gray-400 hover:text-white"
                          >
                            <Icon name={showPassword[user.username] ? 'EyeOff' : 'Eye'} size={16} />
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Роль</p>
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-sm font-semibold ${
                            user.role === 'admin' ? 'bg-gold-600' : 'bg-blue-600'
                          }`}
                        >
                          <Icon name={user.role === 'admin' ? 'Shield' : 'User'} size={14} />
                          {user.role === 'admin' ? 'Администратор' : 'Горничная'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => startEdit(user)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        title="Редактировать"
                      >
                        <Icon name="Edit" size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Удалить пользователя "${user.username}"?`)) {
                            onDeleteUser(user.username);
                          }
                        }}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        title="Удалить"
                      >
                        <Icon name="Trash2" size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
