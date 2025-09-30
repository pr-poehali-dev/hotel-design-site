import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface OwnerReport {
  id: number;
  apartment_number: string;
  check_in_date: string;
  check_out_date: string;
  booking_sum: number;
  total_sum: number;
  commission_percent: number;
  usn_percent: number;
  commission_before_usn: number;
  commission_after_usn: number;
  remaining_before_expenses: number;
  expenses_on_operations: number;
  average_cleaning: number;
  owner_payment: number;
  payment_date: string | null;
  hot_water: number;
  chemical_cleaning: number;
  hygiene_ср_ва: number;
  transportation: number;
  utilities: number;
  other: number;
  note_to_billing: string | null;
}

interface EditReportDialogProps {
  report: OwnerReport | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export default function EditReportDialog({ report, open, onOpenChange, onSave }: EditReportDialogProps) {
  const [formData, setFormData] = useState<OwnerReport | null>(report);
  const [saving, setSaving] = useState(false);

  if (!report || !formData) return null;

  const handleChange = (field: keyof OwnerReport, value: string | number) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSave = async () => {
    if (!formData) return;
    
    setSaving(true);
    try {
      const response = await fetch('https://functions.poehali.dev/e027968a-93da-4665-8c14-1432cbf823c9', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Ошибка сохранения');
      }

      onSave();
      onOpenChange(false);
    } catch (error) {
      alert('Ошибка при сохранении отчета');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактирование отчета</DialogTitle>
          <DialogDescription>
            Апартамент {report.apartment_number} • {new Date(report.check_in_date).toLocaleDateString('ru-RU')} — {new Date(report.check_out_date).toLocaleDateString('ru-RU')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="apartment_number">Номер апартамента</Label>
              <Input
                id="apartment_number"
                value={formData.apartment_number}
                onChange={(e) => handleChange('apartment_number', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="check_in_date">Дата заезда</Label>
              <Input
                id="check_in_date"
                type="date"
                value={formData.check_in_date}
                onChange={(e) => handleChange('check_in_date', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="check_out_date">Дата выезда</Label>
              <Input
                id="check_out_date"
                type="date"
                value={formData.check_out_date}
                onChange={(e) => handleChange('check_out_date', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="booking_sum">Сумма бронирования</Label>
              <Input
                id="booking_sum"
                type="number"
                value={formData.booking_sum}
                onChange={(e) => handleChange('booking_sum', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="total_sum">Итоговая сумма</Label>
              <Input
                id="total_sum"
                type="number"
                value={formData.total_sum}
                onChange={(e) => handleChange('total_sum', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="commission_percent">Комиссия %</Label>
              <Input
                id="commission_percent"
                type="number"
                step="0.01"
                value={formData.commission_percent}
                onChange={(e) => handleChange('commission_percent', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="usn_percent">УСН %</Label>
              <Input
                id="usn_percent"
                type="number"
                step="0.01"
                value={formData.usn_percent}
                onChange={(e) => handleChange('usn_percent', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="owner_payment">Выплата собственнику</Label>
              <Input
                id="owner_payment"
                type="number"
                value={formData.owner_payment}
                onChange={(e) => handleChange('owner_payment', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="average_cleaning">Уборка</Label>
              <Input
                id="average_cleaning"
                type="number"
                value={formData.average_cleaning}
                onChange={(e) => handleChange('average_cleaning', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="hot_water">Горячая вода</Label>
              <Input
                id="hot_water"
                type="number"
                value={formData.hot_water}
                onChange={(e) => handleChange('hot_water', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="chemical_cleaning">Химчистка</Label>
              <Input
                id="chemical_cleaning"
                type="number"
                value={formData.chemical_cleaning}
                onChange={(e) => handleChange('chemical_cleaning', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="transportation">Транспорт</Label>
              <Input
                id="transportation"
                type="number"
                value={formData.transportation}
                onChange={(e) => handleChange('transportation', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="utilities">ЖКХ</Label>
              <Input
                id="utilities"
                type="number"
                value={formData.utilities}
                onChange={(e) => handleChange('utilities', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="other">Прочее</Label>
              <Input
                id="other"
                type="number"
                value={formData.other}
                onChange={(e) => handleChange('other', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="note_to_billing">Примечание</Label>
            <Textarea
              id="note_to_billing"
              value={formData.note_to_billing || ''}
              onChange={(e) => handleChange('note_to_billing', e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? (
              <>
                <Icon name="Loader2" className="animate-spin" size={18} />
                Сохранение...
              </>
            ) : (
              <>
                <Icon name="Save" size={18} />
                Сохранить
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
