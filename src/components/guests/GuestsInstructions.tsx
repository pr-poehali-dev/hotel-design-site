import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const GuestsInstructions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Инструкция по созданию гостя</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center font-semibold flex-shrink-0">
            1
          </div>
          <div>
            <p className="font-semibold text-charcoal-900">Создайте аккаунт</p>
            <p className="text-sm text-charcoal-600">
              Нажмите "Добавить гостя", введите email и сгенерируйте пароль
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center font-semibold flex-shrink-0">
            2
          </div>
          <div>
            <p className="font-semibold text-charcoal-900">Скопируйте данные</p>
            <p className="text-sm text-charcoal-600">
              Скопируйте email и пароль — вам нужно отправить их гостю
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center font-semibold flex-shrink-0">
            3
          </div>
          <div>
            <p className="font-semibold text-charcoal-900">Отправьте гостю</p>
            <p className="text-sm text-charcoal-600">
              Отправьте email и пароль гостю (через WhatsApp, email или другим способом)
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-2">
            <Icon name="Info" size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Адрес личного кабинета:</p>
              <code className="bg-white px-2 py-1 rounded border border-blue-300">
                https://p9apart.ru/guest-login
              </code>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestsInstructions;
