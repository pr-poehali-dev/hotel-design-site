import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface ImportExcelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  adminToken: string;
}

export default function ImportExcelDialog({ open, onOpenChange, onSuccess, adminToken }: ImportExcelDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [apartmentNumber, setApartmentNumber] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        setFile(selectedFile);
      } else {
        toast({
          title: 'Ошибка',
          description: 'Пожалуйста, выберите Excel файл (.xlsx или .xls)',
          variant: 'destructive'
        });
      }
    }
  };

  const handleImport = async () => {
    if (!file || !apartmentNumber) {
      toast({
        title: 'Ошибка',
        description: 'Выберите файл и укажите номер апартамента',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result?.toString().split(',')[1];

        const response = await fetch('https://functions.poehali.dev/fa0147c3-4840-4e85-9dfd-1cd705ea5a3a', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Token': adminToken
          },
          body: JSON.stringify({
            file: base64,
            apartment_number: apartmentNumber
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Ошибка импорта');
        }

        toast({
          title: 'Успешно!',
          description: `Импортировано записей: ${data.count}`,
        });

        setFile(null);
        setApartmentNumber('');
        onOpenChange(false);
        onSuccess();
      };

      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Ошибка импорта',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Импорт из Excel</DialogTitle>
          <DialogDescription>
            Загрузите Excel файл с отчётами для импорта в базу данных
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="apartment">Номер апартамента</Label>
            <Select value={apartmentNumber} onValueChange={setApartmentNumber}>
              <SelectTrigger id="apartment">
                <SelectValue placeholder="Выберите апартамент" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2019">2019</SelectItem>
                <SelectItem value="2111">2111</SelectItem>
                <SelectItem value="3103">3103</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Excel файл</Label>
            <Input
              id="file"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
            />
            {file && (
              <p className="text-sm text-muted-foreground">
                Выбран файл: {file.name}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Отмена
          </Button>
          <Button onClick={handleImport} disabled={loading || !file || !apartmentNumber}>
            {loading ? (
              <>
                <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                Импорт...
              </>
            ) : (
              <>
                <Icon name="Upload" className="mr-2 h-4 w-4" />
                Импортировать
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
