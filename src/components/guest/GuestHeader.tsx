import { useState } from 'react';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface GuestHeaderProps {
  guestName?: string;
  guestEmail?: string;
  onLogout: () => void;
}

const GuestHeader = ({ guestName, guestEmail, onLogout }: GuestHeaderProps) => {
  const [showAppDialog, setShowAppDialog] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [showAndroidInstructions, setShowAndroidInstructions] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-br from-gold-500 via-gold-600 to-amber-600 text-white py-4 md:py-8 shadow-xl">
        <div className="max-w-6xl mx-auto px-3 md:px-4">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <a 
              href="/" 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-gold-200 to-gold-400 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-xl md:text-2xl font-playfair font-bold text-charcoal-900">P9</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-gold-300 rounded-full opacity-80"></div>
              </div>
              <span className="hidden sm:inline font-playfair font-bold text-white text-xs md:text-sm">Premium Apartments</span>
            </a>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAppDialog(true)}
                className="flex items-center gap-1 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm"
                title="Скачать приложение"
              >
                <Icon name="Download" size={16} className="md:w-[18px] md:h-[18px]" />
                <span className="hidden md:inline text-xs md:text-sm font-medium">Приложение</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm"
              >
                <Icon name="LogOut" size={16} className="md:w-[18px] md:h-[18px]" />
                <span className="text-xs md:text-sm font-medium">Выход</span>
              </button>
            </div>
          </div>
          <div className="border-t border-white/30 pt-3 md:pt-4">
            <h1 className="text-lg md:text-2xl font-bold font-playfair mb-1">Личный кабинет гостя</h1>
            <p className="text-gold-100 text-xs md:text-sm">
              {guestName || guestEmail ? `Добро пожаловать, ${guestName || guestEmail}!` : 'Вся информация о вашем бронировании'}
            </p>
          </div>
        </div>
      </div>

    <Dialog open={showAppDialog} onOpenChange={setShowAppDialog}>
      <DialogContent className="max-w-sm w-[95vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Icon name="Smartphone" size={24} className="text-gold-600" />
            Скачать приложение P9
          </DialogTitle>
          <DialogDescription className="text-sm">
            Выберите вашу операционную систему
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 py-2">
          <button
            onClick={() => {
              setShowAppDialog(false);
              setShowIOSInstructions(true);
            }}
            className="w-full flex items-center gap-3 p-4 bg-charcoal-50 hover:bg-charcoal-100 rounded-xl transition-colors"
          >
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
              <Icon name="Apple" size={28} className="text-charcoal-900" />
            </div>
            <div className="text-left flex-1">
              <div className="font-semibold text-charcoal-900">iPhone / iPad</div>
              <div className="text-sm text-charcoal-600">Установка на iOS</div>
            </div>
            <Icon name="ChevronRight" size={20} className="text-charcoal-400" />
          </button>

          <button
            onClick={() => {
              setShowAppDialog(false);
              setShowAndroidInstructions(true);
            }}
            className="w-full flex items-center gap-3 p-4 bg-charcoal-50 hover:bg-charcoal-100 rounded-xl transition-colors"
          >
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
              <Icon name="Smartphone" size={28} className="text-white" />
            </div>
            <div className="text-left flex-1">
              <div className="font-semibold text-charcoal-900">Android</div>
              <div className="text-sm text-charcoal-600">Установка на Android</div>
            </div>
            <Icon name="ChevronRight" size={20} className="text-charcoal-400" />
          </button>
        </div>
      </DialogContent>
    </Dialog>

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

export default GuestHeader;