import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface ImageUploadSectionProps {
  images: string[];
  imageUrl: string;
  isUploadingImage: boolean;
  onImageUrlChange: (value: string) => void;
  onAddImage: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

const ImageUploadSection = ({
  images,
  imageUrl,
  isUploadingImage,
  onImageUrlChange,
  onAddImage,
  onImageUpload,
  onRemoveImage,
}: ImageUploadSectionProps) => {
  return (
    <div className="space-y-2">
      <Label>Фотографии</Label>
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            disabled={isUploadingImage}
            className="flex-1"
          />
          {isUploadingImage && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Icon name="Loader2" size={18} className="animate-spin" />
              Загрузка...
            </div>
          )}
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">или</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Input
            value={imageUrl}
            onChange={(e) => onImageUrlChange(e.target.value)}
            placeholder="Вставьте ссылку на изображение"
          />
          <Button type="button" onClick={onAddImage}>
            <Icon name="Plus" size={18} className="mr-2" />
            Добавить
          </Button>
        </div>
      </div>
      {images && images.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {images.map((img, idx) => (
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
                onClick={() => onRemoveImage(idx)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploadSection;
