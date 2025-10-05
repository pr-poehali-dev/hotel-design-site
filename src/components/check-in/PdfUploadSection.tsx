import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface PdfUploadSectionProps {
  pdfFiles: string[];
  pdfUrl: string;
  isUploading: boolean;
  onPdfUrlChange: (value: string) => void;
  onAddPdf: () => void;
  onPdfUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePdf: (index: number) => void;
}

const PdfUploadSection = ({
  pdfFiles,
  pdfUrl,
  isUploading,
  onPdfUrlChange,
  onAddPdf,
  onPdfUpload,
  onRemovePdf,
}: PdfUploadSectionProps) => {
  const handleButtonClick = () => {
    document.getElementById('pdf-upload-input')?.click();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>PDF документы</Label>
        <span className="text-xs text-gray-500 flex items-center">
          <Icon name="ArrowRight" size={14} className="mr-1" />
          Появятся во вкладке "Документы" у гостя
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            id="pdf-upload-input"
            type="file"
            accept=".pdf,application/pdf"
            onChange={onPdfUpload}
            disabled={isUploading}
            className="hidden"
          />
          <Button
            type="button"
            onClick={handleButtonClick}
            disabled={isUploading}
            variant="outline"
            className="flex-1"
          >
            {isUploading ? (
              <>
                <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                Загрузка...
              </>
            ) : (
              <>
                <Icon name="FileUp" size={18} className="mr-2" />
                Загрузить PDF с компьютера
              </>
            )}
          </Button>
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
            value={pdfUrl}
            onChange={(e) => onPdfUrlChange(e.target.value)}
            placeholder="Вставьте ссылку на PDF файл"
          />
          <Button type="button" onClick={onAddPdf}>
            <Icon name="Plus" size={18} className="mr-2" />
            Добавить
          </Button>
        </div>
      </div>
      {pdfFiles && pdfFiles.length > 0 && (
        <div className="space-y-2 mt-4">
          {pdfFiles.map((pdf, idx) => (
            <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg group">
              <Icon name="FileText" size={20} className="text-red-600" />
              <a 
                href={pdf} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 text-sm text-blue-600 hover:underline truncate"
              >
                {pdf}
              </a>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemovePdf(idx)}
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

export default PdfUploadSection;