import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CheckInInstruction } from '@/types/checkin';

const API_URL = 'https://functions.poehali.dev/a629b99f-4972-4b9b-a55e-469c3d770ca7';

export const useCheckInInstructions = (apartmentId: string) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<CheckInInstruction>>({
    title: '',
    description: '',
    images: [],
    pdf_files: [],
    instruction_text: '',
    important_notes: '',
    contact_info: '',
    wifi_info: '',
    parking_info: '',
    house_rules: '',
  });

  useEffect(() => {
    if (apartmentId) {
      loadInstructions(apartmentId);
    } else {
      resetForm();
    }
  }, [apartmentId]);

  const loadInstructions = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}?apartment_id=${id}`);
      const data = await response.json();
      
      if (data) {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          images: data.images || [],
          pdf_files: data.pdf_files || [],
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
      pdf_files: [],
      instruction_text: '',
      important_notes: '',
      contact_info: '',
      wifi_info: '',
      parking_info: '',
      house_rules: '',
    });
  };

  const saveInstructions = async () => {
    if (!apartmentId) {
      toast({
        title: 'Ошибка',
        description: 'Выберите апартамент',
        variant: 'destructive',
      });
      return false;
    }

    setIsLoading(true);

    try {
      const instructionData = {
        apartment_id: apartmentId,
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
        return true;
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
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: keyof CheckInInstruction, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    isLoading,
    updateField,
    saveInstructions,
    setFormData,
  };
};
