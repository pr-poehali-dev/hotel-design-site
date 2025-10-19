import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

interface BookingFormData {
  apartment_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  total_amount: string;
  aggregator_commission: string;
}

interface BookingFormProps {
  formData: BookingFormData;
  apartments: Array<{ apartmentId: string; ownerName: string }>;
  loading: boolean;
  onSave: () => void;
  onCancel: () => void;
  onChange: (data: BookingFormData) => void;
}

export default function BookingForm({
  formData,
  apartments,
  loading,
  onSave,
  onCancel,
  onChange,
}: BookingFormProps) {
  return (
    <Card className="bg-blue-500/10 border border-blue-500/30 p-4 space-y-3 animate-fade-in shadow-lg">
      <h3 className="text-xl font-semibold text-white">Новое бронирование</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-slate-300 mb-1 block">Апартамент *</label>
          <select
            value={formData.apartment_id}
            onChange={(e) => onChange({ ...formData, apartment_id: e.target.value })}
            className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
          >
            <option value="">Выберите апартамент</option>
            {apartments.map(apt => (
              <option key={apt.apartmentId} value={apt.apartmentId}>
                {apt.apartmentId} - {apt.ownerName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-300 mb-1 block">Имя гостя *</label>
          <Input
            value={formData.guest_name}
            onChange={(e) => onChange({ ...formData, guest_name: e.target.value })}
            placeholder="Иван Иванов"
            className="bg-white/10 border-white/20 text-white"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300 mb-1 block">Email гостя</label>
          <Input
            type="email"
            value={formData.guest_email}
            onChange={(e) => onChange({ ...formData, guest_email: e.target.value })}
            placeholder="guest@example.com"
            className="bg-white/10 border-white/20 text-white"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300 mb-1 block">Телефон гостя</label>
          <Input
            value={formData.guest_phone}
            onChange={(e) => onChange({ ...formData, guest_phone: e.target.value })}
            placeholder="+7 999 123 45 67"
            className="bg-white/10 border-white/20 text-white"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300 mb-1 block">Заезд *</label>
          <Input
            type="date"
            value={formData.check_in}
            onChange={(e) => onChange({ ...formData, check_in: e.target.value })}
            className="bg-white/10 border-white/20 text-white"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300 mb-1 block">Выезд *</label>
          <Input
            type="date"
            value={formData.check_out}
            onChange={(e) => onChange({ ...formData, check_out: e.target.value })}
            className="bg-white/10 border-white/20 text-white"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300 mb-1 block">Сумма проживания *</label>
          <Input
            type="number"
            value={formData.total_amount}
            onChange={(e) => onChange({ ...formData, total_amount: e.target.value })}
            placeholder="15000"
            className="bg-white/10 border-white/20 text-white"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300 mb-1 block">Комиссия агрегатора (%)</label>
          <Input
            type="number"
            value={formData.aggregator_commission}
            onChange={(e) => onChange({ ...formData, aggregator_commission: e.target.value })}
            placeholder="15"
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button 
          onClick={onSave} 
          disabled={loading}
          className="hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Icon name="Check" size={16} />
          Сохранить
        </Button>
        <Button 
          onClick={onCancel} 
          variant="outline"
          className="hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Icon name="X" size={16} />
          Отмена
        </Button>
      </div>
    </Card>
  );
}
