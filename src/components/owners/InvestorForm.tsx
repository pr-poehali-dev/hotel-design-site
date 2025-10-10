import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface InvestorFormData {
  username: string;
  password: string;
  apartment_number: string;
  full_name: string;
  email: string;
  phone: string;
}

interface InvestorFormProps {
  formData: InvestorFormData;
  loading: boolean;
  onSave: () => void;
  onCancel: () => void;
  onChange: (form: InvestorFormData) => void;
}

export default function InvestorForm({
  formData,
  loading,
  onSave,
  onCancel,
  onChange,
}: InvestorFormProps) {
  return (
    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4 space-y-3">
      <h3 className="text-xl font-semibold text-white">Новый инвестор</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-slate-300 mb-1 block">Логин *</label>
          <Input
            value={formData.username}
            onChange={(e) => onChange({ ...formData, username: e.target.value })}
            placeholder="investor1"
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
        <div>
          <label className="text-sm text-slate-300 mb-1 block">Пароль *</label>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => onChange({ ...formData, password: e.target.value })}
            placeholder="••••••••"
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
        <div>
          <label className="text-sm text-slate-300 mb-1 block">ФИО *</label>
          <Input
            value={formData.full_name}
            onChange={(e) => onChange({ ...formData, full_name: e.target.value })}
            placeholder="Иван Иванов"
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
        <div>
          <label className="text-sm text-slate-300 mb-1 block">Номер апартамента</label>
          <Input
            value={formData.apartment_number}
            onChange={(e) => onChange({ ...formData, apartment_number: e.target.value })}
            placeholder="2019"
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
        <div>
          <label className="text-sm text-slate-300 mb-1 block">Email</label>
          <Input
            value={formData.email}
            onChange={(e) => onChange({ ...formData, email: e.target.value })}
            placeholder="investor@example.com"
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
        <div>
          <label className="text-sm text-slate-300 mb-1 block">Телефон</label>
          <Input
            value={formData.phone}
            onChange={(e) => onChange({ ...formData, phone: e.target.value })}
            placeholder="+7 999 123 45 67"
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={onSave} disabled={loading}>
          <Icon name="Check" size={16} />
          Создать
        </Button>
        <Button onClick={onCancel} variant="outline">
          <Icon name="X" size={16} />
          Отмена
        </Button>
      </div>
    </div>
  );
}
