import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { Guest } from '@/types/guest';

interface GuestDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (guest: Partial<Guest>) => void;
  guest?: Guest | null;
}

const GuestDialog = ({ open, onClose, onSave, guest }: GuestDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    login: '',
    password: '',
    is_vip: false,
    notes: '',
    bonus_points: 0
  });

  useEffect(() => {
    if (guest) {
      setFormData({
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
        login: guest.login || '',
        password: guest.password || '',
        is_vip: guest.is_vip,
        notes: guest.notes,
        bonus_points: guest.bonus_points || 0
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        login: '',
        password: '',
        is_vip: false,
        notes: '',
        bonus_points: 0
      });
    }
  }, [guest, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {guest ? 'Редактировать гостя' : 'Новый гость'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">
              Имя *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
              placeholder="Иван Иванов"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
              placeholder="guest@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-700">
              Телефон *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
              placeholder="+7 (999) 123-45-67"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="login" className="text-gray-700">
                Логин
              </Label>
              <Input
                id="login"
                value={formData.login}
                onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                placeholder="Логин для входа"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Пароль
              </Label>
              <Input
                id="password"
                type="text"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                placeholder="Пароль для входа"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-700">
              Заметки
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 min-h-[100px]"
              placeholder="Дополнительная информация о госте..."
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="flex items-center gap-2">
                <Icon name="Crown" size={20} className="text-yellow-600" />
                <Label htmlFor="is_vip" className="text-gray-900 font-semibold cursor-pointer">
                  VIP статус
                </Label>
              </div>
              <Switch
                id="is_vip"
                checked={formData.is_vip}
                onCheckedChange={(checked) => setFormData({ ...formData, is_vip: checked })}
              />
            </div>

            {formData.is_vip && (
              <div className="space-y-2">
                <Label htmlFor="bonus_points" className="text-gray-700 flex items-center gap-2">
                  <Icon name="Star" size={16} className="text-yellow-600" />
                  Бонусные баллы (1 балл = 1 рубль)
                </Label>
                <Input
                  id="bonus_points"
                  type="number"
                  min="0"
                  value={formData.bonus_points}
                  onChange={(e) => setFormData({ ...formData, bonus_points: parseInt(e.target.value) || 0 })}
                  className="bg-white border-gray-300 text-gray-900"
                  placeholder="0"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white border-0"
            >
              <Icon name="Save" size={18} className="mr-2" />
              {guest ? 'Сохранить' : 'Создать'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GuestDialog;