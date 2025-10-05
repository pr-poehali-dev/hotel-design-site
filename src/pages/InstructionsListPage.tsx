import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const API_URL = 'https://functions.poehali.dev/a629b99f-4972-4b9b-a55e-469c3d770ca7';

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

interface InstructionSummary {
  apartment_id: string;
  apartment_name: string;
  title?: string;
  hasPhotos: boolean;
  hasPdfs: boolean;
  hasInstructions: boolean;
  photosCount: number;
  pdfsCount: number;
}

const InstructionsListPage = () => {
  const navigate = useNavigate();
  const [instructions, setInstructions] = useState<InstructionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllInstructions();
  }, []);

  const loadAllInstructions = async () => {
    setLoading(true);
    const summaries: InstructionSummary[] = [];

    for (const apt of apartments) {
      try {
        const response = await fetch(`${API_URL}?apartment_id=${apt.id}`);
        const data = await response.json();

        if (data && data.apartment_id) {
          summaries.push({
            apartment_id: apt.id,
            apartment_name: apt.name,
            title: data.title || 'Без названия',
            hasPhotos: data.images && data.images.length > 0,
            hasPdfs: data.pdf_files && data.pdf_files.length > 0,
            hasInstructions: !!(data.instruction_text || data.important_notes || data.contact_info),
            photosCount: data.images ? data.images.length : 0,
            pdfsCount: data.pdf_files ? data.pdf_files.length : 0,
          });
        } else {
          summaries.push({
            apartment_id: apt.id,
            apartment_name: apt.name,
            title: 'Не создана',
            hasPhotos: false,
            hasPdfs: false,
            hasInstructions: false,
            photosCount: 0,
            pdfsCount: 0,
          });
        }
      } catch (error) {
        console.error(`Ошибка загрузки для ${apt.id}:`, error);
        summaries.push({
          apartment_id: apt.id,
          apartment_name: apt.name,
          title: 'Ошибка загрузки',
          hasPhotos: false,
          hasPdfs: false,
          hasInstructions: false,
          photosCount: 0,
          pdfsCount: 0,
        });
      }
    }

    setInstructions(summaries);
    setLoading(false);
  };

  const handleEdit = (apartmentId: string) => {
    navigate(`/check-in-instructions?apartment=${apartmentId}`);
  };

  const handleCreate = (apartmentId: string) => {
    navigate(`/check-in-instructions?apartment=${apartmentId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="animate-spin text-gold-500 mx-auto mb-4" />
          <p className="text-gray-600">Загрузка инструкций...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-white py-8 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a 
                href="/" 
                className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
              >
                <Icon name="Building2" size={32} className="text-white" />
                <span className="text-2xl font-playfair font-bold">InnStyle</span>
              </a>
              <div className="border-l border-white/30 pl-4 ml-2">
                <h1 className="text-2xl font-bold font-playfair">Все инструкции</h1>
                <p className="text-gold-100 text-sm">Управление инструкциями по апартаментам</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="text-white border-white hover:bg-white/10"
                onClick={() => navigate('/bookings')}
              >
                <Icon name="ArrowLeft" size={18} className="mr-2" />
                Назад к бронированиям
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-4">
          {instructions.map((instruction) => (
            <Card 
              key={instruction.apartment_id} 
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl font-playfair">
                        {instruction.apartment_name}
                      </CardTitle>
                      {instruction.title === 'Не создана' ? (
                        <Badge variant="outline" className="text-gray-500">
                          Нет инструкции
                        </Badge>
                      ) : instruction.hasInstructions ? (
                        <Badge className="bg-green-500">
                          <Icon name="CheckCircle" size={14} className="mr-1" />
                          Заполнена
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-500">
                          <Icon name="AlertCircle" size={14} className="mr-1" />
                          Частично
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {instruction.title}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Icon 
                        name="Image" 
                        size={18} 
                        className={instruction.hasPhotos ? 'text-blue-500' : 'text-gray-300'} 
                      />
                      <span className={instruction.hasPhotos ? 'text-gray-900' : 'text-gray-400'}>
                        {instruction.photosCount} фото
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon 
                        name="FileText" 
                        size={18} 
                        className={instruction.hasPdfs ? 'text-red-500' : 'text-gray-300'} 
                      />
                      <span className={instruction.hasPdfs ? 'text-gray-900' : 'text-gray-400'}>
                        {instruction.pdfsCount} PDF
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon 
                        name="FileText" 
                        size={18} 
                        className={instruction.hasInstructions ? 'text-green-500' : 'text-gray-300'} 
                      />
                      <span className={instruction.hasInstructions ? 'text-gray-900' : 'text-gray-400'}>
                        {instruction.hasInstructions ? 'Инструкции заполнены' : 'Нет инструкций'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {instruction.title === 'Не создана' ? (
                      <Button 
                        onClick={() => handleCreate(instruction.apartment_id)}
                        variant="default"
                      >
                        <Icon name="Plus" size={18} className="mr-2" />
                        Создать
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleEdit(instruction.apartment_id)}
                        variant="outline"
                      >
                        <Icon name="Edit" size={18} className="mr-2" />
                        Редактировать
                      </Button>
                    )}
                    <Button 
                      onClick={() => window.open(`/guest-dashboard?apartment=${instruction.apartment_id}`, '_blank')}
                      variant="outline"
                    >
                      <Icon name="Eye" size={18} className="mr-2" />
                      Просмотр
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructionsListPage;