import { useState } from 'react';
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
  const [selectedApartment, setSelectedApartment] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  
  const { formData, isLoading, updateField, saveInstructions, setFormData } = 
    useCheckInInstructions(selectedApartment);
  
  const { uploadImage, uploadPdf, isUploadingImage, isUploadingPdf } = useFileUpload();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveInstructions();
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
            <p className="text-sm text-gray-500 mt-2">
              <Icon name="Info" size={16} className="inline mr-1" />
              Вы можете загружать файлы с компьютера или добавлять по ссылке
            </p>
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
