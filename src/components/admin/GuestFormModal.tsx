import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface GuestFormData {
  username: string;
  password: string;
  email: string;
  name: string;
  phone: string;
  guest_type: string;
  assigned_apartments: string[];
  admin_notes: string;
  is_vip: boolean;
}

interface GuestFormModalProps {
  isCreating: boolean;
  isEditing: boolean;
  formData: GuestFormData;
  apartmentCategories: Array<{ id: string; name: string }>;
  loading: boolean;
  showPassword: { [key: number]: boolean };
  onFormChange: (data: GuestFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onTogglePassword: (key: number) => void;
}

export default function GuestFormModal({
  isCreating,
  isEditing,
  formData,
  apartmentCategories,
  loading,
  showPassword,
  onFormChange,
  onSubmit,
  onCancel,
  onTogglePassword
}: GuestFormModalProps) {
  if (!isCreating && !isEditing) return null;

  const toggleApartment = (apartmentId: string) => {
    const current = formData.assigned_apartments || [];
    const updated = current.includes(apartmentId)
      ? current.filter(id => id !== apartmentId)
      : [...current, apartmentId];
    onFormChange({ ...formData, assigned_apartments: updated });
  };

  return (
    <Card className="bg-white/10 border-white/20 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          {isCreating ? 'Создать гостя' : 'Редактировать гостя'}
        </h2>
        <Button
          onClick={onCancel}
          variant="ghost"
          className="text-white/70 hover:text-white"
        >
          <Icon name="X" size={20} />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-white text-sm mb-2 block">
              Логин <span className="text-red-400">*</span>
            </label>
            <Input
              value={formData.username}
              onChange={(e) => onFormChange({ ...formData, username: e.target.value })}
              placeholder="guest123"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div>
            <label className="text-white text-sm mb-2 block">
              {isCreating ? 'Пароль' : 'Новый пароль'} {isCreating && <span className="text-red-400">*</span>}
            </label>
            <div className="relative">
              <Input
                type={showPassword[1] ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => onFormChange({ ...formData, password: e.target.value })}
                placeholder={isCreating ? 'Введите пароль' : 'Оставьте пустым, чтобы не менять'}
                className="bg-white/10 border-white/20 text-white pr-10"
              />
              <button
                type="button"
                onClick={() => onTogglePassword(1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              >
                <Icon name={showPassword[1] ? 'EyeOff' : 'Eye'} size={16} />
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="text-white text-sm mb-2 block">
            Email <span className="text-red-400">*</span>
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => onFormChange({ ...formData, email: e.target.value })}
            placeholder="guest@example.com"
            className="bg-white/10 border-white/20 text-white"
          />
        </div>

        <div>
          <label className="text-white text-sm mb-2 block">
            ФИО <span className="text-red-400">*</span>
          </label>
          <Input
            value={formData.name}
            onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
            placeholder="Иванов Иван Иванович"
            className="bg-white/10 border-white/20 text-white"
          />
        </div>

        <div>
          <label className="text-white text-sm mb-2 block">Телефон</label>
          <Input
            value={formData.phone}
            onChange={(e) => onFormChange({ ...formData, phone: e.target.value })}
            placeholder="+7 999 123-45-67"
            className="bg-white/10 border-white/20 text-white"
          />
        </div>

        <div>
          <label className="text-white text-sm mb-2 block">Тип гостя</label>
          <select
            value={formData.guest_type}
            onChange={(e) => onFormChange({ ...formData, guest_type: e.target.value })}
            className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
          >
            <option value="regular">Обычный</option>
            <option value="vip">VIP</option>
            <option value="corporate">Корпоративный</option>
            <option value="blacklist">Чёрный список</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-white cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_vip}
              onChange={(e) => onFormChange({ ...formData, is_vip: e.target.checked })}
              className="w-4 h-4"
            />
            <span>VIP статус</span>
          </label>
        </div>

        <div>
          <label className="text-white text-sm mb-2 block">
            Назначенные категории (справочно)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {apartmentCategories.map((apt) => (
              <label
                key={apt.id}
                className="flex items-center gap-2 text-white/80 cursor-pointer hover:text-white"
              >
                <input
                  type="checkbox"
                  checked={formData.assigned_apartments?.includes(apt.id)}
                  onChange={() => toggleApartment(apt.id)}
                  className="w-4 h-4"
                />
                <span className="text-sm">{apt.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-white text-sm mb-2 block">Внутренние заметки</label>
          <textarea
            value={formData.admin_notes}
            onChange={(e) => onFormChange({ ...formData, admin_notes: e.target.value })}
            placeholder="Заметки видны только админу..."
            rows={3}
            className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 resize-none"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={onSubmit}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Icon name="Check" size={16} />
            {isCreating ? 'Создать' : 'Сохранить'}
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 text-white border-white/30"
          >
            <Icon name="X" size={16} />
            Отмена
          </Button>
        </div>
      </div>
    </Card>
  );
}
