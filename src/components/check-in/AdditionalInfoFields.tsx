import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckInInstruction } from '@/types/checkin';

interface AdditionalInfoFieldsProps {
  formData: Partial<CheckInInstruction>;
  onFieldChange: (field: keyof CheckInInstruction, value: string) => void;
}

const AdditionalInfoFields = ({ formData, onFieldChange }: AdditionalInfoFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="instruction">Инструкция по заселению</Label>
        <Textarea
          id="instruction"
          value={formData.instruction_text}
          onChange={(e) => onFieldChange('instruction_text', e.target.value)}
          placeholder="Как пройти в апартамент, где получить ключи и т.д."
          rows={5}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="important">Важная информация</Label>
        <Textarea
          id="important"
          value={formData.important_notes}
          onChange={(e) => onFieldChange('important_notes', e.target.value)}
          placeholder="Важные заметки для гостей"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact">Контактная информация</Label>
        <Textarea
          id="contact"
          value={formData.contact_info}
          onChange={(e) => onFieldChange('contact_info', e.target.value)}
          placeholder="Телефон, email для связи"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="wifi">Wi-Fi информация</Label>
        <Textarea
          id="wifi"
          value={formData.wifi_info}
          onChange={(e) => onFieldChange('wifi_info', e.target.value)}
          placeholder="Название сети и пароль"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="parking">Информация о парковке</Label>
        <Textarea
          id="parking"
          value={formData.parking_info}
          onChange={(e) => onFieldChange('parking_info', e.target.value)}
          placeholder="Где можно припарковаться"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rules">Правила проживания</Label>
        <Textarea
          id="rules"
          value={formData.house_rules}
          onChange={(e) => onFieldChange('house_rules', e.target.value)}
          placeholder="Правила дома"
          rows={3}
        />
      </div>
    </>
  );
};

export default AdditionalInfoFields;
