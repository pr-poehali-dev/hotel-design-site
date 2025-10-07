import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface CheckInInstruction {
  title: string;
  description?: string;
  images: string[];
  pdf_files?: string[];
  instruction_text?: string;
  important_notes?: string;
  contact_info?: string;
  wifi_info?: string;
  parking_info?: string;
  house_rules?: string;
}

interface InstructionTabsProps {
  instruction: CheckInInstruction;
}

const InstructionTabs = ({ instruction }: InstructionTabsProps) => {
  return {
    instruction: (
      <Card>
        <CardHeader>
          <CardTitle className="font-playfair">{instruction.title}</CardTitle>
          {instruction.description && (
            <p className="text-gray-600 mt-2">{instruction.description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {instruction.instruction_text && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <Icon name="MapPin" size={20} className="mr-2 text-gold-500" />
                Как добраться
              </h3>
              <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {instruction.instruction_text}
              </p>
            </div>
          )}

          <Separator />

          {instruction.important_notes && (
            <div className="bg-gold-50 border border-gold-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 flex items-center text-gold-900">
                <Icon name="AlertCircle" size={20} className="mr-2" />
                Важная информация
              </h3>
              <p className="text-gray-700">{instruction.important_notes}</p>
            </div>
          )}

          {instruction.wifi_info && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <Icon name="Wifi" size={20} className="mr-2 text-gold-500" />
                Wi-Fi
              </h3>
              <p className="whitespace-pre-wrap text-gray-700 font-mono bg-gray-50 p-3 rounded">
                {instruction.wifi_info}
              </p>
            </div>
          )}

          {instruction.parking_info && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <Icon name="Car" size={20} className="mr-2 text-gold-500" />
                Парковка
              </h3>
              <p className="text-gray-700">{instruction.parking_info}</p>
            </div>
          )}
        </CardContent>
      </Card>
    ),
    photos: (
      <Card>
        <CardHeader>
          <CardTitle>Фотографии апартамента</CardTitle>
        </CardHeader>
        <CardContent>
          {instruction.images && instruction.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {instruction.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Апартамент ${idx + 1}`}
                  className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Icon name="Image" size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Фотографии скоро появятся</p>
            </div>
          )}
        </CardContent>
      </Card>
    ),
    documents: (
      <Card>
        <CardHeader>
          <CardTitle>Документы и инструкции</CardTitle>
        </CardHeader>
        <CardContent>
          {instruction.pdf_files && instruction.pdf_files.length > 0 ? (
            <div className="space-y-3">
              {instruction.pdf_files.map((pdf, idx) => (
                <a
                  key={idx}
                  href={pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <Icon name="FileText" size={24} className="text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Документ {idx + 1}</p>
                    <p className="text-sm text-gray-500 truncate">{pdf}</p>
                  </div>
                  <Icon name="Download" size={20} className="text-gray-400 group-hover:text-gold-500 transition-colors" />
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Icon name="FileText" size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Документы пока не добавлены</p>
            </div>
          )}
        </CardContent>
      </Card>
    ),
    contacts: (
      <Card>
        <CardHeader>
          <CardTitle>Контактная информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {instruction.contact_info ? (
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-start">
                <Icon name="Phone" size={24} className="mr-4 text-gold-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Связаться с нами</h3>
                  <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {instruction.contact_info}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Контактная информация появится позже
            </p>
          )}
        </CardContent>
      </Card>
    ),
    rules: (
      <Card>
        <CardHeader>
          <CardTitle>Правила проживания</CardTitle>
        </CardHeader>
        <CardContent>
          {instruction.house_rules ? (
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {instruction.house_rules}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Правила проживания появятся позже
            </p>
          )}
        </CardContent>
      </Card>
    ),
  };
};

export default InstructionTabs;
