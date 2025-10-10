import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface CreateCredentialsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guestName: string;
  guestEmail: string;
  onSubmit: (login: string, password: string) => void;
}

const CreateCredentialsDialog = ({
  open,
  onOpenChange,
  guestName,
  guestEmail,
  onSubmit,
}: CreateCredentialsDialogProps) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let newPassword = '';
    for (let i = 0; i < 12; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
  };

  const handleSubmit = () => {
    if (!login.trim() || !password.trim()) {
      return;
    }
    onSubmit(login, password);
    setLogin('');
    setPassword('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="UserCog" size={20} className="text-gold-600" />
            Создать учётные данные
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-gold-50 rounded-lg border border-gold-200">
            <p className="text-sm font-semibold text-charcoal-900">{guestName}</p>
            <p className="text-xs text-charcoal-600">{guestEmail}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="login">Логин для входа</Label>
            <div className="flex gap-2">
              <Input
                id="login"
                placeholder="username"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(login)}
                disabled={!login}
              >
                <Icon name="Copy" size={16} />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <div className="flex gap-2">
              <Input
                id="password"
                placeholder="Введите или сгенерируйте"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generatePassword}
              >
                <Icon name="Shuffle" size={16} />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(password)}
                disabled={!password}
              >
                <Icon name="Copy" size={16} />
              </Button>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-2">
              <Icon name="Info" size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-900">
                Эти данные будут отправлены гостю для входа в личный кабинет.
                Сохраните их в надёжном месте.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!login.trim() || !password.trim()}
            className="bg-gold-500 hover:bg-gold-600"
          >
            <Icon name="Save" size={16} className="mr-2" />
            Создать
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCredentialsDialog;
