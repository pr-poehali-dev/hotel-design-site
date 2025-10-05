import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const UPLOAD_URL = 'https://functions.poehali.dev/dfff5e5a-a1f7-4528-b522-fac2b98407f8';

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const useFileUpload = () => {
  const { toast } = useToast();
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);

  const uploadFile = async (
    file: File,
    fileType: 'image' | 'pdf'
  ): Promise<string | null> => {
    const setUploading = fileType === 'image' ? setIsUploadingImage : setIsUploadingPdf;
    
    const maxSize = fileType === 'image' ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
    const typeCheck = fileType === 'image' 
      ? file.type.startsWith('image/')
      : file.type === 'application/pdf';
    
    if (!typeCheck) {
      toast({
        title: 'Ошибка',
        description: fileType === 'image' 
          ? 'Можно загружать только изображения'
          : 'Можно загружать только PDF файлы',
        variant: 'destructive',
      });
      return null;
    }

    if (file.size > maxSize) {
      toast({
        title: 'Ошибка',
        description: fileType === 'image'
          ? 'Размер изображения не должен превышать 5MB'
          : 'Размер файла не должен превышать 10MB',
        variant: 'destructive',
      });
      return null;
    }

    setUploading(true);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const result = reader.result?.toString().split(',')[1];
          if (result) resolve(result);
          else reject(new Error('Ошибка чтения файла'));
        };
        reader.onerror = () => reject(new Error('Ошибка чтения файла'));
      });

      const response = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: base64,
          fileName: file.name,
          fileType: file.type,
        }),
      });

      const result: UploadResult = await response.json();

      if (result.success && result.url) {
        toast({
          title: 'Успешно',
          description: fileType === 'image' ? 'Изображение загружено' : 'PDF файл загружен',
        });
        return result.url;
      } else {
        throw new Error(result.error || 'Ошибка загрузки');
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      toast({
        title: 'Ошибка',
        description: fileType === 'image' 
          ? 'Не удалось загрузить изображение'
          : 'Не удалось загрузить файл',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadImage = (file: File) => uploadFile(file, 'image');
  const uploadPdf = (file: File) => uploadFile(file, 'pdf');

  return {
    uploadImage,
    uploadPdf,
    isUploadingImage,
    isUploadingPdf,
  };
};
