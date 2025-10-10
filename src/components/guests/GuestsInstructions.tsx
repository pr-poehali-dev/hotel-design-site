import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const GuestsInstructions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Возможности гостевого кабинета</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center flex-shrink-0">
            <Icon name="Upload" size={20} />
          </div>
          <div>
            <p className="font-semibold text-charcoal-900">Загрузка документов</p>
            <p className="text-sm text-charcoal-600 mt-1">
              Гости могут загружать фотографии и документы в форматах JPEG и PDF
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestsInstructions;
