import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SendGuestEmailButtonProps {
  bookingId: string;
  apartmentId: string;
  guestEmail?: string;
  guestName?: string;
}

const SendGuestEmailButton = ({
  bookingId,
  apartmentId,
  guestEmail: initialEmail = '',
  guestName: initialName = '',
}: SendGuestEmailButtonProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(initialEmail);
  const [name, setName] = useState(initialName);

  const handleSendEmail = async () => {
    if (!email) {
      toast({
        title: 'Ошибка',
        description: 'Введите email гостя',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('https://functions.poehali.dev/a48834f9-9efc-4f7c-90aa-3b6cb5ab8089', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guest_email: email,
          guest_name: name || 'Гость',
          booking_id: bookingId,
          apartment_id: apartmentId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Email отправлен!',
          description: `Ссылка на личный кабинет отправлена на ${email}`,
        });
        setOpen(false);
      } else {
        throw new Error(data.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: 'Ошибка отправки',
        description: error instanceof Error ? error.message : 'Не удалось отправить email. Проверьте настройки SMTP.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Icon name="Mail" size={16} className="mr-2" />
          Отправить гостю
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Отправить инструкции гостю</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="guest-name">Имя гостя</Label>
            <Input
              id="guest-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Иван Иванов"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guest-email">Email гостя *</Label>
            <Input
              id="guest-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="guest@example.com"
              required
            />
          </div>
          <div className="bg-gold-50 border border-gold-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              Гость получит письмо со ссылкой на личный кабинет, где будет вся информация о бронировании и инструкции по заселению.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Отмена
          </Button>
          <Button onClick={handleSendEmail} disabled={loading}>
            {loading ? (
              <>
                <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                Отправка...
              </>
            ) : (
              <>
                <Icon name="Send" size={16} className="mr-2" />
                Отправить
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendGuestEmailButton;
