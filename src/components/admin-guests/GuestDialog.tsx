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
    is_vip: false,
    notes: ''
  });

  useEffect(() => {
    if (guest) {
      setFormData({
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
        is_vip: guest.is_vip,
        notes: guest.notes
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        is_vip: false,
        notes: ''
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
      <DialogContent className="bg-gradient-to-br from-gray-900 to-gray-800 border-white/10 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {guest ? 'Редактировать гостя' : 'Новый гость'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white/80">
              Имя *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-500/50"
              placeholder="Иван Иванов"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/80">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-500/50"
              placeholder="guest@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white/80">
              Телефон *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-500/50"
              placeholder="+7 (999) 123-45-67"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white/80">
              Заметки
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-500/50 min-h-[100px]"
              placeholder="Дополнительная информация о госте..."
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
            <div className="flex items-center gap-2">
              <Icon name="Crown" size={20} className="text-yellow-400" />
              <Label htmlFor="is_vip" className="text-white font-semibold cursor-pointer">
                VIP статус
              </Label>
            </div>
            <Switch
              id="is_vip"
              checked={formData.is_vip}
              onCheckedChange={(checked) => setFormData({ ...formData, is_vip: checked })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
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
