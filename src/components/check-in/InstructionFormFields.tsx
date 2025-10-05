import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckInInstruction } from '@/types/checkin';

interface InstructionFormFieldsProps {
  formData: Partial<CheckInInstruction>;
  onFieldChange: (field: keyof CheckInInstruction, value: string) => void;
}

const InstructionFormFields = ({ formData, onFieldChange }: InstructionFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Заголовок</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onFieldChange('title', e.target.value)}
          placeholder="Например: Добро пожаловать в апартаменты 816"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onFieldChange('description', e.target.value)}
          placeholder="Краткое описание апартамента"
          rows={3}
        />
      </div>
    </>
  );
};

export default InstructionFormFields;
