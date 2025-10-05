import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const API_URL = 'https://functions.poehali.dev/a629b99f-4972-4b9b-a55e-469c3d770ca7';

interface CheckInInstruction {
  id: string;
  apartment_id: string;
  title: string;
  description?: string;
  images: string[];
  instruction_text?: string;
  important_notes?: string;
  contact_info?: string;
  wifi_info?: string;
  parking_info?: string;
  house_rules?: string;
}

const CheckInInstructionsPage = () => {
  const { toast } = useToast();
  const [selectedApartment, setSelectedApartment] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<CheckInInstruction>>({
    title: '',
    description: '',
    images: [],
    instruction_text: '',
    important_notes: '',
    contact_info: '',
    wifi_info: '',
    parking_info: '',
    house_rules: '',
  });

  // Загрузка инструкций при выборе апартамента
  useEffect(() => {
    if (selectedApartment) {
      loadInstructions(selectedApartment);
    } else {
      resetForm();
    }
  }, [selectedApartment]);

  const loadInstructions = async (apartmentId: string) => {
    try {
      const response = await fetch(`${API_URL}?apartment_id=${apartmentId}`);
      const data = await response.json();
      
      if (data) {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          images: data.images || [],
          instruction_text: data.instruction_text || '',
          important_notes: data.important_notes || '',
          contact_info: data.contact_info || '',
          wifi_info: data.wifi_info || '',
          parking_info: data.parking_info || '',
          house_rules: data.house_rules || '',
        });
      } else {
        resetForm();
      }
    } catch (error) {
      console.error('Ошибка загрузки инструкций:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      images: [],
      instruction_text: '',
      important_notes: '',
      contact_info: '',
      wifi_info: '',
      parking_info: '',
      house_rules: '',
    });
  };

  const apartments = [
    { id: '2019', name: '2х комнатный 2019' },
    { id: '1116', name: '3х комнатный 1116' },
    { id: '2119', name: '2х комнатный 2119' },
    { id: '2110', name: '3х комнатный 2110' },
    { id: '1401', name: '2х комнатный 1401' },
    { id: '2817', name: '3х комнатный 2817' },
    { id: '1311', name: '2х комнатный 1311' },
    { id: '2111', name: '3х комнатный 2111' },
    { id: 'royal', name: 'Королевский люкс' },
    { id: '816', name: '3х комнатный 816' },
  ];

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), imageUrl.trim()],
      }));
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedApartment) {
      toast({
        title: 'Ошибка',
        description: 'Выберите апартамент',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const instructionData = {
        apartment_id: selectedApartment,
        ...formData,
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(instructionData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Успешно сохранено',
          description: 'Инструкция по заселению обновлена',
        });
      } else {
        throw new Error(result.message || 'Ошибка сохранения');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить инструкцию',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal-900 font-playfair mb-2">
            Инструкции по заселению
          </h1>
          <p className="text-gray-600">
            Добавьте фото, описание и инструкции для гостей
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Создать инструкцию</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Выберите апартамент</Label>
                <Select value={selectedApartment} onValueChange={setSelectedApartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите апартамент" />
                  </SelectTrigger>
                  <SelectContent>
                    {apartments.map(apt => (
                      <SelectItem key={apt.id} value={apt.id}>
                        {apt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Заголовок</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Например: Добро пожаловать в апартаменты 816"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Краткое описание апартамента"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Фотографии</Label>
                <div className="flex gap-2">
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Вставьте ссылку на изображение"
                  />
                  <Button type="button" onClick={handleAddImage}>
                    <Icon name="Plus" size={18} className="mr-2" />
                    Добавить
                  </Button>
                </div>
                {formData.images && formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveImage(idx)}
                        >
                          <Icon name="X" size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="instruction">Инструкция по заселению</Label>
                <Textarea
                  id="instruction"
                  value={formData.instruction_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, instruction_text: e.target.value }))}
                  placeholder="Как пройти в апартамент, где получить ключи и т.д."
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="important">Важная информация</Label>
                <Textarea
                  id="important"
                  value={formData.important_notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, important_notes: e.target.value }))}
                  placeholder="Важные заметки для гостей"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Контактная информация</Label>
                <Textarea
                  id="contact"
                  value={formData.contact_info}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_info: e.target.value }))}
                  placeholder="Телефон, email для связи"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wifi">Wi-Fi информация</Label>
                <Textarea
                  id="wifi"
                  value={formData.wifi_info}
                  onChange={(e) => setFormData(prev => ({ ...prev, wifi_info: e.target.value }))}
                  placeholder="Название сети и пароль"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parking">Информация о парковке</Label>
                <Textarea
                  id="parking"
                  value={formData.parking_info}
                  onChange={(e) => setFormData(prev => ({ ...prev, parking_info: e.target.value }))}
                  placeholder="Где можно припарковаться"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rules">Правила проживания</Label>
                <Textarea
                  id="rules"
                  value={formData.house_rules}
                  onChange={(e) => setFormData(prev => ({ ...prev, house_rules: e.target.value }))}
                  placeholder="Правила дома"
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Icon name="Save" size={18} className="mr-2" />
                      Сохранить инструкцию
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                  <Icon name="ArrowLeft" size={18} className="mr-2" />
                  Назад
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckInInstructionsPage;