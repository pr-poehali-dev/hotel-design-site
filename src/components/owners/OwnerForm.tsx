import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface OwnerFormData {
  apartmentId: string;
  ownerEmail: string;
  ownerName: string;
  commissionRate: number;
  username: string;
  password: string;
}

interface OwnerFormProps {
  formData: OwnerFormData;
  loading: boolean;
  isNew: boolean;
  onSave: () => void;
  onCancel: () => void;
  onChange: (form: OwnerFormData) => void;
}

export default function OwnerForm({
  formData,
  loading,
  isNew,
  onSave,
  onCancel,
  onChange,
}: OwnerFormProps) {
  return (
    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3 animate-fade-in shadow-lg max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold text-white">
        {isNew ? 'Новый собственник' : 'Редактирование'}
      </h3>
      <div className="space-y-3">
        <div>
          <label className="text-sm text-slate-300 mb-1 block">
            ID апартамента
          </label>
          <Input
            value={formData.apartmentId}
            onChange={(e) =>
              onChange({ ...formData, apartmentId: e.target.value })
            }
            placeholder="1759775560156"
            className="bg-white/10 border-white/20 text-white"
            disabled={!isNew}
          />
        </div>
        <div>
          <label className="text-sm text-slate-300 mb-1 block">
            Имя собственника
          </label>
          <Input
            value={formData.ownerName}
            onChange={(e) =>
              onChange({ ...formData, ownerName: e.target.value })
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
              onChange({ ...formData, ownerEmail: e.target.value })
            }
            placeholder="owner@example.com"
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
        <div>
          <label className="text-sm text-slate-300 mb-1 block">Комиссия (%)</label>
          <select
            value={formData.commissionRate}
            onChange={(e) =>
              onChange({ ...formData, commissionRate: Number(e.target.value) })
            }
            className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white rounded-md focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          >
            <option value={0}>0%</option>
            <option value={15}>15%</option>
            <option value={20}>20%</option>
            <option value={25}>25%</option>
          </select>
        </div>
        {isNew && (
          <>
            <div>
              <label className="text-sm text-slate-300 mb-1 block">Логин для входа</label>
              <Input
                value={formData.username}
                onChange={(e) =>
                  onChange({ ...formData, username: e.target.value })
                }
                placeholder="ivan_ivanov"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-1 block">Пароль</label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  onChange({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </>
        )}
        <div className="flex gap-2">
          <Button onClick={onSave} disabled={loading} className="hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg disabled:hover:scale-100">
            <Icon name="Check" size={16} />
            Сохранить
          </Button>
          <Button onClick={onCancel} variant="outline" className="hover:scale-105 active:scale-95 transition-all duration-200">
            <Icon name="X" size={16} />
            Отмена
          </Button>
        </div>
      </div>
    </div>
  );
}