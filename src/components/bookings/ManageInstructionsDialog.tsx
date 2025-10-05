import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const API_URL = 'https://functions.poehali.dev/a629b99f-4972-4b9b-a55e-469c3d770ca7';
const UPLOAD_URL = 'https://functions.poehali.dev/dfff5e5a-a1f7-4528-b522-fac2b98407f8';

interface ManageInstructionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apartmentId: string;
  guestName: string;
}

interface InstructionData {
  title: string;
  description: string;
  instruction_text: string;
  important_notes: string;
  contact_info: string;
  wifi_info: string;
  parking_info: string;
  house_rules: string;
  images: string[];
  pdf_files: string[];
}

const ManageInstructionsDialog = ({
  open,
  onOpenChange,
  apartmentId,
  guestName,
}: ManageInstructionsDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState<InstructionData>({
    title: '',
    description: '',
    instruction_text: '',
    important_notes: '',
    contact_info: '',
    wifi_info: '',
    parking_info: '',
    house_rules: '',
    images: [],
    pdf_files: [],
  });

  useEffect(() => {
    if (open && apartmentId) {
      loadInstructions();
    }
  }, [open, apartmentId]);

  const loadInstructions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?apartment_id=${apartmentId}`);
      const result = await response.json();
      
      if (result && result.apartment_id) {
        setData({
          title: result.title || '',
          description: result.description || '',
          instruction_text: result.instruction_text || '',
          important_notes: result.important_notes || '',
          contact_info: result.contact_info || '',
          wifi_info: result.wifi_info || '',
          parking_info: result.parking_info || '',
          house_rules: result.house_rules || '',
          images: result.images || [],
          pdf_files: result.pdf_files || [],
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apartment_id: apartmentId,
          ...data,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Сохранено',
          description: 'Инструкции обновлены для гостя',
        });
        onOpenChange(false);
      } else {
        throw new Error('Ошибка сохранения');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Ошибка', description: 'Можно загружать только изображения', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const result = reader.result?.toString().split(',')[1];
          if (result) resolve(result);
          else reject(new Error('Ошибка чтения'));
        };
        reader.onerror = reject;
      });

      const response = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: base64, fileName: file.name, fileType: file.type }),
      });

      const result = await response.json();

      if (result.success && result.url) {
        setData(prev => ({ ...prev, images: [...prev.images, result.url] }));
        toast({ title: 'Успешно', description: 'Изображение загружено' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось загрузить', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
    e.target.value = '';
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({ title: 'Ошибка', description: 'Можно загружать только PDF', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const result = reader.result?.toString().split(',')[1];
          if (result) resolve(result);
          else reject(new Error('Ошибка чтения'));
        };
        reader.onerror = reject;
      });

      const response = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: base64, fileName: file.name, fileType: file.type }),
      });

      const result = await response.json();

      if (result.success && result.url) {
        setData(prev => ({ ...prev, pdf_files: [...prev.pdf_files, result.url] }));
        toast({ title: 'Успешно', description: 'PDF загружен' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось загрузить', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
    e.target.value = '';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Управление инструкциями для {guestName}</DialogTitle>
          <DialogDescription>
            Апартамент {apartmentId} - добавьте инструкции, фото и документы
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Icon name="Loader2" size={32} className="animate-spin text-gold-500" />
          </div>
        ) : (
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text">
                <Icon name="FileText" size={16} className="mr-2" />
                Тексты
              </TabsTrigger>
              <TabsTrigger value="files">
                <Icon name="Upload" size={16} className="mr-2" />
                Файлы
              </TabsTrigger>
              <TabsTrigger value="contacts">
                <Icon name="Phone" size={16} className="mr-2" />
                Контакты
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Заголовок</Label>
                <Input
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="Добро пожаловать!"
                />
              </div>

              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea
                  value={data.description}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                  placeholder="Краткое описание"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Инструкция по заселению</Label>
                <Textarea
                  value={data.instruction_text}
                  onChange={(e) => setData({ ...data, instruction_text: e.target.value })}
                  placeholder="Как добраться, где получить ключи..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Важная информация</Label>
                <Textarea
                  value={data.important_notes}
                  onChange={(e) => setData({ ...data, important_notes: e.target.value })}
                  placeholder="Важные заметки для гостя"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Правила проживания</Label>
                <Textarea
                  value={data.house_rules}
                  onChange={(e) => setData({ ...data, house_rules: e.target.value })}
                  placeholder="Правила дома"
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="files" className="space-y-4 mt-4">
              <div className="space-y-3">
                <Label>Фотографии</Label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  disabled={uploading}
                >
                  <Icon name="Upload" size={18} className="mr-2" />
                  {uploading ? 'Загрузка...' : 'Загрузить фото'}
                </Button>
                {data.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {data.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img} alt="" className="w-full h-24 object-cover rounded" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                          onClick={() => setData({ ...data, images: data.images.filter((_, i) => i !== idx) })}
                        >
                          <Icon name="X" size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label>PDF документы</Label>
                <input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handlePdfUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById('pdf-upload')?.click()}
                  disabled={uploading}
                >
                  <Icon name="FileUp" size={18} className="mr-2" />
                  {uploading ? 'Загрузка...' : 'Загрузить PDF'}
                </Button>
                {data.pdf_files.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {data.pdf_files.map((pdf, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded group">
                        <Icon name="FileText" size={18} className="text-red-600" />
                        <span className="flex-1 text-sm truncate">{pdf}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100"
                          onClick={() => setData({ ...data, pdf_files: data.pdf_files.filter((_, i) => i !== idx) })}
                        >
                          <Icon name="X" size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="contacts" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Контактная информация</Label>
                <Textarea
                  value={data.contact_info}
                  onChange={(e) => setData({ ...data, contact_info: e.target.value })}
                  placeholder="Телефон, email для связи"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Wi-Fi</Label>
                <Textarea
                  value={data.wifi_info}
                  onChange={(e) => setData({ ...data, wifi_info: e.target.value })}
                  placeholder="Название сети и пароль"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Парковка</Label>
                <Textarea
                  value={data.parking_info}
                  onChange={(e) => setData({ ...data, parking_info: e.target.value })}
                  placeholder="Где можно припарковаться"
                  rows={2}
                />
              </div>
            </TabsContent>
          </Tabs>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={loading || uploading}>
            {loading ? (
              <>
                <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Icon name="Save" size={18} className="mr-2" />
                Сохранить
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManageInstructionsDialog;
