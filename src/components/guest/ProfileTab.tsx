import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface GuestUser {
  id: number;
  email: string;
  name: string;
  phone: string;
  username?: string;
  is_vip: boolean;
  guest_type: string;
  total_bookings: number;
  total_spent: string;
  promo_codes?: any[];
  assigned_apartments?: string[];
}

interface ProfileForm {
  name: string;
  phone: string;
  password: string;
}

interface ProfileTabProps {
  guestUser: GuestUser;
  editingProfile: boolean;
  profileForm: ProfileForm;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onFormChange: (form: ProfileForm) => void;
}

export default function ProfileTab({
  guestUser,
  editingProfile,
  profileForm,
  onEdit,
  onCancel,
  onSave,
  onFormChange
}: ProfileTabProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white/10 border-white/20 p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Мой профиль</h2>

        {!editingProfile ? (
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-white/60 text-sm mb-1">ФИО</div>
              <div className="text-white font-medium">{guestUser.name}</div>
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-white/60 text-sm mb-1">Email</div>
              <div className="text-white">{guestUser.email}</div>
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-white/60 text-sm mb-1">Телефон</div>
              <div className="text-white">{guestUser.phone || 'Не указан'}</div>
            </div>

            {guestUser.username && (
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="text-white/60 text-sm mb-1">Логин</div>
                <div className="text-white">{guestUser.username}</div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div className="text-purple-300 text-sm mb-1">Всего броней</div>
                <div className="text-white text-2xl font-bold">{guestUser.total_bookings}</div>
              </div>
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="text-green-300 text-sm mb-1">Потрачено</div>
                <div className="text-white text-2xl font-bold">{parseFloat(guestUser.total_spent).toLocaleString()} ₽</div>
              </div>
            </div>

            <Button 
              onClick={onEdit}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Icon name="Edit" size={16} />
              Редактировать профиль
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm mb-2 block">ФИО</label>
              <Input
                value={profileForm.name}
                onChange={(e) => onFormChange({ ...profileForm, name: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Телефон</label>
              <Input
                value={profileForm.phone}
                onChange={(e) => onFormChange({ ...profileForm, phone: e.target.value })}
                placeholder="+7 999 123-45-67"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">
                Новый пароль (оставьте пустым, чтобы не менять)
              </label>
              <Input
                type="password"
                value={profileForm.password}
                onChange={(e) => onFormChange({ ...profileForm, password: e.target.value })}
                placeholder="••••••••"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={onSave}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Icon name="Check" size={16} />
                Сохранить
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
        )}
      </Card>
    </div>
  );
}
