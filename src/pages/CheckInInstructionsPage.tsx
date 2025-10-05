import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ImageUploadSection from '@/components/check-in/ImageUploadSection';
import PdfUploadSection from '@/components/check-in/PdfUploadSection';
import VideoUploadSection from '@/components/check-in/VideoUploadSection';
import InstructionFormFields from '@/components/check-in/InstructionFormFields';
import AdditionalInfoFields from '@/components/check-in/AdditionalInfoFields';
import { useCheckInInstructions } from '@/hooks/useCheckInInstructions';
import { useFileUpload } from '@/hooks/useFileUpload';
import { CheckInInstruction } from '@/types/checkin';

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

const CheckInInstructionsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedApartment, setSelectedApartment] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  
  const { formData, isLoading, updateField, saveInstructions, setFormData } = 
    useCheckInInstructions(selectedApartment);
  
  const { uploadImage, uploadPdf, isUploadingImage, isUploadingPdf } = useFileUpload();

  useEffect(() => {
    const apartmentFromUrl = searchParams.get('apartment');
    if (apartmentFromUrl) {
      setSelectedApartment(apartmentFromUrl);
    }
  }, [searchParams]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadImage(file);
    if (url) {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), url],
      }));
    }
    e.target.value = '';
  };

  const handleAddPdf = () => {
    if (pdfUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        pdf_files: [...(prev.pdf_files || []), pdfUrl.trim()],
      }));
      setPdfUrl('');
    }
  };

  const handleRemovePdf = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pdf_files: prev.pdf_files?.filter((_, i) => i !== index) || [],
    }));
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadPdf(file);
    if (url) {
      setFormData(prev => ({
        ...prev,
        pdf_files: [...(prev.pdf_files || []), url],
      }));
    }
    e.target.value = '';
  };

  const handleAddVideo = () => {
    if (videoUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        videos: [...(prev.videos || []), videoUrl.trim()],
      }));
      setVideoUrl('');
    }
  };

  const handleRemoveVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveInstructions();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <a 
                href="/" 
                className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-playfair font-bold text-charcoal-900">P9</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold-300 rounded-full opacity-80"></div>
                </div>
                <span className="font-playfair font-bold text-gold-600 text-xs">Premium Apartments</span>
              </a>
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-2xl font-bold text-charcoal-900 font-playfair">
                  Инструкции по заселению
                </h1>
                <p className="text-gray-600 text-sm">
                  Добавьте фото, описание и инструкции для гостей
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/instructions-list')}
            >
              <Icon name="List" size={18} className="mr-2" />
              Все инструкции
            </Button>
          </div>
          
          <Card className="bg-gradient-to-r from-gold-50 to-blue-50 border-gold-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center">
                      <Icon name="Upload" size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">1. Загрузите</p>
                      <p className="text-xs text-gray-600">Фото, PDF, текст</p>
                    </div>
                  </div>
                  <Icon name="ArrowRight" size={24} className="text-gray-400" />
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Icon name="Save" size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">2. Сохраните</p>
                      <p className="text-xs text-gray-600">Данные в базу</p>
                    </div>
                  </div>
                  <Icon name="ArrowRight" size={24} className="text-gray-400" />
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">3. Гость увидит</p>
                      <p className="text-xs text-gray-600">В личном кабинете</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Создать инструкцию</CardTitle>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Icon name="Save" size={16} />
                <span>Черновик сохраняется автоматически</span>
              </div>
            </div>
            <div className="space-y-2 mt-3">
              <p className="text-sm text-gray-500">
                <Icon name="Info" size={16} className="inline mr-1" />
                Вы можете загружать файлы с компьютера или добавлять по ссылке
              </p>
              <div className="bg-gold-50 border border-gold-200 rounded-lg p-3">
                <p className="text-sm text-gold-900 flex items-start">
                  <Icon name="Eye" size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    Все загруженные фото, PDF документы и инструкции автоматически появятся в личном кабинете гостя
                  </span>
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900 flex items-start">
                  <Icon name="AlertCircle" size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    Нажмите "Сохранить инструкцию" внизу страницы, чтобы данные появились у гостя
                  </span>
                </p>
              </div>
            </div>
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

              <InstructionFormFields 
                formData={formData}
                onFieldChange={updateField}
              />

              <ImageUploadSection
                images={formData.images || []}
                imageUrl={imageUrl}
                isUploadingImage={isUploadingImage}
                onImageUrlChange={setImageUrl}
                onAddImage={handleAddImage}
                onImageUpload={handleImageUpload}
                onRemoveImage={handleRemoveImage}
              />

              <PdfUploadSection
                pdfFiles={formData.pdf_files || []}
                pdfUrl={pdfUrl}
                isUploading={isUploadingPdf}
                onPdfUrlChange={setPdfUrl}
                onAddPdf={handleAddPdf}
                onPdfUpload={handlePdfUpload}
                onRemovePdf={handleRemovePdf}
              />

              <VideoUploadSection
                videos={formData.videos || []}
                videoUrl={videoUrl}
                onVideoUrlChange={setVideoUrl}
                onAddVideo={handleAddVideo}
                onRemoveVideo={handleRemoveVideo}
              />

              <AdditionalInfoFields
                formData={formData}
                onFieldChange={updateField}
              />

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
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => window.open('/guest-dashboard', '_blank')}
                >
                  <Icon name="Eye" size={18} className="mr-2" />
                  Предпросмотр
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