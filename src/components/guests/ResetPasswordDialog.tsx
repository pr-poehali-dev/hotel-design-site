import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resetEmail: string;
  resetPassword: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onGeneratePassword: () => void;
  onSubmit: () => void;
}

const ResetPasswordDialog = ({
  open,
  onOpenChange,
  resetEmail,
  resetPassword,
  onEmailChange,
  onPasswordChange,
  onGeneratePassword,
  onSubmit,
}: ResetPasswordDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-playfair text-2xl">Сбросить пароль</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="reset-email">Email гостя *</Label>
            <Input
              id="reset-email"
              type="email"
              placeholder="guest@example.com"
              value={resetEmail}
              onChange={(e) => onEmailChange(e.target.value)}
            />
            <p className="text-xs text-charcoal-500 mt-1">
              Введите email гостя, которому нужно сбросить пароль
            </p>
          </div>

          <div>
            <Label htmlFor="reset-password">Новый пароль *</Label>
            <div className="flex gap-2">
              <Input
                id="reset-password"
                type="text"
                placeholder="Введите или сгенерируйте"
                value={resetPassword}
                onChange={(e) => onPasswordChange(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={onGeneratePassword}
                title="Сгенерировать пароль"
              >
                <Icon name="RefreshCw" size={18} />
              </Button>
            </div>
            <p className="text-xs text-charcoal-500 mt-1">
              Скопируйте новый пароль и отправьте его гостю
            </p>
          </div>

          {resetPassword && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex gap-2 mb-2">
                <Icon name="AlertTriangle" size={18} className="text-amber-600 flex-shrink-0" />
                <p className="text-sm font-semibold text-amber-900">
                  Новый пароль для гостя:
                </p>
              </div>
              <code className="block bg-white px-3 py-2 rounded border border-amber-300 text-sm">
                {resetPassword}
              </code>
              <p className="text-xs text-amber-700 mt-2">
                Скопируйте и отправьте этот пароль гостю
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button
            onClick={onSubmit}
            className="bg-gold-500 hover:bg-gold-600"
          >
            <Icon name="KeyRound" size={18} className="mr-2" />
            Сбросить пароль
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordDialog;
