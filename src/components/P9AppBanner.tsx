import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const P9AppBanner = () => {
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [showAndroidInstructions, setShowAndroidInstructions] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-br from-gold-500 via-gold-400 to-amber-500 rounded-2xl p-6 shadow-2xl border border-gold-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-20 -mb-20 blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center">
              <span className="text-3xl font-bold bg-gradient-to-br from-gold-600 to-amber-600 bg-clip-text text-transparent">P9</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white drop-shadow-md">Приложение P9</h3>
              <p className="text-white/90 text-sm">Всегда под рукой</p>
            </div>
          </div>

          <p className="text-white/95 mb-5 leading-relaxed">
            Скачайте приложение P9 на свой телефон для быстрого доступа к бронированию и всем функциям
          </p>

          <div className="flex gap-3">
            <Button
              onClick={() => setShowIOSInstructions(true)}
              className="flex-1 bg-white hover:bg-white/90 text-charcoal-900 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 gap-2 py-6"
            >
              <Icon name="Apple" size={24} />
              <div className="text-left">
                <div className="text-xs opacity-70">Скачать для</div>
                <div className="text-sm font-bold">iOS</div>
              </div>
            </Button>

            <Button
              onClick={() => setShowAndroidInstructions(true)}
              className="flex-1 bg-charcoal-900 hover:bg-charcoal-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 gap-2 py-6"
            >
              <Icon name="Smartphone" size={24} />
              <div className="text-left">
                <div className="text-xs opacity-70">Скачать для</div>
                <div className="text-sm font-bold">Android</div>
              </div>
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showIOSInstructions} onOpenChange={setShowIOSInstructions}>
        <DialogContent className="max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl md:text-2xl">
              <Icon name="Apple" size={24} className="text-charcoal-900 md:w-7 md:h-7" />
              Установка на iOS
            </DialogTitle>
            <DialogDescription className="text-sm">
              Добавьте ярлык P9 на рабочий стол iPhone
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 md:space-y-5 py-2 md:py-4">
            <div className="flex gap-3 md:gap-4 items-start">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gold-500 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg text-sm md:text-base">
                1
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold mb-1 text-sm md:text-base text-charcoal-900">Откройте меню Safari</h4>
                <p className="text-xs md:text-sm text-charcoal-800">
                  Нажмите на кнопку <Icon name="Share" size={14} className="inline mx-1" /> "Поделиться" внизу экрана
                </p>
              </div>
            </div>

            <div className="flex gap-3 md:gap-4 items-start">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gold-500 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg text-sm md:text-base">
                2
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold mb-1 text-sm md:text-base text-charcoal-900">Найдите нужный пункт</h4>
                <p className="text-xs md:text-sm text-charcoal-800">
                  Пролистайте список и выберите <Icon name="PlusSquare" size={14} className="inline mx-1" /> "На экран Домой"
                </p>
              </div>
            </div>

            <div className="flex gap-3 md:gap-4 items-start">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gold-500 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg text-sm md:text-base">
                3
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold mb-1 text-sm md:text-base text-charcoal-900">Подтвердите добавление</h4>
                <p className="text-xs md:text-sm text-charcoal-800">
                  Нажмите "Добавить" в правом верхнем углу. Готово! <Icon name="CheckCircle" size={14} className="inline mx-1 text-green-600" />
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 md:p-4 mt-4 md:mt-6">
              <div className="flex gap-2 items-start">
                <Icon name="Lightbulb" size={18} className="text-amber-600 flex-shrink-0 mt-0.5 md:w-5 md:h-5" />
                <p className="text-xs md:text-sm text-amber-900">
                  <strong>Совет:</strong> Теперь иконка P9 будет на главном экране как обычное приложение!
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAndroidInstructions} onOpenChange={setShowAndroidInstructions}>
        <DialogContent className="max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl md:text-2xl">
              <Icon name="Smartphone" size={24} className="text-green-600 md:w-7 md:h-7" />
              Установка на Android
            </DialogTitle>
            <DialogDescription className="text-sm">
              Добавьте ярлык P9 на рабочий стол Android
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 md:space-y-5 py-2 md:py-4">
            <div className="flex gap-3 md:gap-4 items-start">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg text-sm md:text-base">
                1
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold mb-1 text-sm md:text-base text-charcoal-900">Откройте меню Chrome</h4>
                <p className="text-xs md:text-sm text-charcoal-800">
                  Нажмите на три точки <Icon name="MoreVertical" size={14} className="inline mx-1" /> в правом верхнем углу браузера
                </p>
              </div>
            </div>

            <div className="flex gap-3 md:gap-4 items-start">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg text-sm md:text-base">
                2
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold mb-1 text-sm md:text-base text-charcoal-900">Установите приложение</h4>
                <p className="text-xs md:text-sm text-charcoal-800">
                  Выберите <Icon name="Download" size={14} className="inline mx-1" /> "Установить приложение" или "Добавить на главный экран"
                </p>
              </div>
            </div>

            <div className="flex gap-3 md:gap-4 items-start">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg text-sm md:text-base">
                3
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold mb-1 text-sm md:text-base text-charcoal-900">Подтвердите установку</h4>
                <p className="text-xs md:text-sm text-charcoal-800">
                  Нажмите "Установить" или "Добавить". Готово! <Icon name="CheckCircle" size={14} className="inline mx-1 text-green-600" />
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mt-4 md:mt-6">
              <div className="flex gap-2 items-start">
                <Icon name="Info" size={18} className="text-blue-600 flex-shrink-0 mt-0.5 md:w-5 md:h-5" />
                <p className="text-xs md:text-sm text-blue-900">
                  <strong>Альтернатива:</strong> Если не видите кнопку установки, попробуйте открыть сайт в Chrome браузере
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default P9AppBanner;