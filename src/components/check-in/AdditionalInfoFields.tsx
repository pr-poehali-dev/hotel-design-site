import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckInInstruction } from '@/types/checkin';
import Icon from '@/components/ui/icon';

interface AdditionalInfoFieldsProps {
  formData: Partial<CheckInInstruction>;
  onFieldChange: (field: keyof CheckInInstruction, value: string) => void;
}

const AdditionalInfoFields = ({ formData, onFieldChange }: AdditionalInfoFieldsProps) => {
  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-900 flex items-start">
          <Icon name="Info" size={16} className="mr-2 mt-0.5 flex-shrink-0" />
          <span>
            Все поля ниже попадут во вкладку "Инструкция" в личном кабинете гостя. Заполните нужные разделы.
          </span>
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="instruction">Инструкция по заселению</Label>
          <span className="text-xs text-gray-500">→ Раздел "Как добраться"</span>
        </div>
        <Textarea
          id="instruction"
          value={formData.instruction_text}
          onChange={(e) => onFieldChange('instruction_text', e.target.value)}
          placeholder="Как пройти в апартамент, где получить ключи и т.д."
          rows={5}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="important">Важная информация</Label>
          <span className="text-xs text-gray-500">→ Желтый блок с предупреждением</span>
        </div>
        <Textarea
          id="important"
          value={formData.important_notes}
          onChange={(e) => onFieldChange('important_notes', e.target.value)}
          placeholder="Важные заметки для гостей"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="contact">Контактная информация</Label>
          <span className="text-xs text-gray-500">→ Вкладка "Контакты"</span>
        </div>
        <Textarea
          id="contact"
          value={formData.contact_info}
          onChange={(e) => onFieldChange('contact_info', e.target.value)}
          placeholder="Телефон, email для связи"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="wifi">Wi-Fi информация</Label>
          <span className="text-xs text-gray-500">→ Раздел "Wi-Fi"</span>
        </div>
        <Textarea
          id="wifi"
          value={formData.wifi_info}
          onChange={(e) => onFieldChange('wifi_info', e.target.value)}
          placeholder="Название сети и пароль"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="parking">Информация о парковке</Label>
          <span className="text-xs text-gray-500">→ Раздел "Парковка"</span>
        </div>
        <Textarea
          id="parking"
          value={formData.parking_info}
          onChange={(e) => onFieldChange('parking_info', e.target.value)}
          placeholder="Где можно припарковаться"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="rules">Правила проживания</Label>
          <span className="text-xs text-gray-500">→ Вкладка "Правила"</span>
        </div>
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