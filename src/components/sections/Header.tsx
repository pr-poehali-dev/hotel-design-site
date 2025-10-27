import Icon from '@/components/ui/icon';
import { FizzyButton } from '@/components/ui/fizzy-button';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface HeaderProps {
  navigation?: Array<{ id: string; label: string; icon: string }>;
  currentSection?: string;
  onNavigate?: (section: string) => void;
}

const Header = ({ navigation = [], currentSection = '', onNavigate = () => {} }: HeaderProps) => {
  const [showAppMenu, setShowAppMenu] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [showAndroidInstructions, setShowAndroidInstructions] = useState(false);

  return (
    <header className="bg-charcoal-900 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 to-transparent"></div>
      <div className="container mx-auto px-6 py-4 relative z-10">
        <div className="flex justify-between items-center">
          <a 
            href="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
          >
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl sm:text-2xl font-playfair font-bold text-charcoal-900">P9</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gold-300 rounded-full opacity-80"></div>
            </div>
            <div className="flex flex-col leading-tight">
              <h1 className="font-playfair font-bold text-gold-400 text-xs sm:text-sm md:text-base lg:text-lg whitespace-nowrap">
                Premium Apartments
              </h1>
              <p className="font-playfair font-semibold text-gold-400/70 text-[10px] sm:text-xs md:text-sm whitespace-nowrap">
                Moscow
              </p>
            </div>
          </a>
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button
              onClick={() => setShowAppMenu(true)}
              variant="ghost"
              size="sm"
              className="md:hidden text-gold-400 hover:text-gold-300 hover:bg-gold-500/10 flex items-center gap-1.5 px-2"
            >
              <Icon name="Download" size={16} />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[10px] font-medium whitespace-nowrap">Скачать</span>
                <div className="flex items-center gap-0.5">
                  <Icon name="Apple" size={12} />
                  <Icon name="Smartphone" size={12} />
                </div>
              </div>
            </Button>
            <nav className="hidden md:flex space-x-2">
              {navigation.map((item) => (
                <FizzyButton
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'reports') {
                      window.location.href = '/reports';
                    } else if (item.id === 'housekeeping') {
                      window.location.href = '/housekeeping';
                    } else if (item.id === 'bookings-admin') {
                      window.location.href = '/bookings';
                    } else {
                      onNavigate(item.id);
                    }
                  }}
                  variant={currentSection === item.id ? 'primary' : 'secondary'}
                  icon={<Icon name={item.icon as any} size={16} />}
                  className="text-sm"
                >
                  {item.label}
                </FizzyButton>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <Sheet open={showAppMenu} onOpenChange={setShowAppMenu}>
        <SheetContent side="bottom" className="h-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-charcoal-900">P9</span>
              </div>
              Скачать приложение
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-3 mt-6">
            <Button
              onClick={() => {
                setShowAppMenu(false);
                setShowIOSInstructions(true);
              }}
              className="w-full bg-white hover:bg-gray-50 text-charcoal-900 font-semibold shadow-lg gap-2 py-6 border border-gray-200"
            >
              <Icon name="Apple" size={24} />
              <div className="text-left">
                <div className="text-xs opacity-70">Скачать для</div>
                <div className="text-sm font-bold">iOS</div>
              </div>
            </Button>
            <Button
              onClick={() => {
                setShowAppMenu(false);
                setShowAndroidInstructions(true);
              }}
              className="w-full bg-charcoal-900 hover:bg-charcoal-800 text-white font-semibold shadow-lg gap-2 py-6"
            >
              <Icon name="Smartphone" size={24} />
              <div className="text-left">
                <div className="text-xs opacity-70">Скачать для</div>
                <div className="text-sm font-bold">Android</div>
              </div>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={showIOSInstructions} onOpenChange={setShowIOSInstructions}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-xl">
              <Icon name="Apple" size={24} className="text-charcoal-900" />
              Установка на iOS
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4 mt-4">
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-gold-500 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg text-sm">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1 text-sm text-charcoal-900">Откройте меню Safari</h4>
                <p className="text-xs text-charcoal-700">
                  Нажмите на кнопку <Icon name="Share" size={14} className="inline mx-1" /> "Поделиться" внизу экрана
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-gold-500 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg text-sm">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1 text-sm text-charcoal-900">Найдите нужный пункт</h4>
                <p className="text-xs text-charcoal-700">
                  Пролистайте список и выберите <Icon name="PlusSquare" size={14} className="inline mx-1" /> "На экран Домой"
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-gold-500 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg text-sm">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1 text-sm text-charcoal-900">Подтвердите добавление</h4>
                <p className="text-xs text-charcoal-700">
                  Нажмите "Добавить" в правом верхнем углу. Готово! <Icon name="CheckCircle" size={14} className="inline mx-1 text-green-600" />
                </p>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
              <div className="flex gap-2 items-start">
                <Icon name="Lightbulb" size={18} className="text-amber-600 flex-shrink-0" />
                <p className="text-xs text-amber-900">
                  <strong>Совет:</strong> Теперь иконка P9 будет на главном экране как обычное приложение!
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={showAndroidInstructions} onOpenChange={setShowAndroidInstructions}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-xl">
              <Icon name="Smartphone" size={24} className="text-green-600" />
              Установка на Android
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4 mt-4">
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg text-sm">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1 text-sm text-charcoal-900">Откройте меню Chrome</h4>
                <p className="text-xs text-charcoal-700">
                  Нажмите на три точки <Icon name="MoreVertical" size={14} className="inline mx-1" /> в правом верхнем углу браузера
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg text-sm">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1 text-sm text-charcoal-900">Установите приложение</h4>
                <p className="text-xs text-charcoal-700">
                  Выберите <Icon name="Download" size={14} className="inline mx-1" /> "Установить приложение" или "Добавить на главный экран"
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg text-sm">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1 text-sm text-charcoal-900">Подтвердите установку</h4>
                <p className="text-xs text-charcoal-700">
                  Нажмите "Установить" или "Добавить". Готово! <Icon name="CheckCircle" size={14} className="inline mx-1 text-green-600" />
                </p>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
              <div className="flex gap-2 items-start">
                <Icon name="Lightbulb" size={18} className="text-green-600 flex-shrink-0" />
                <p className="text-xs text-green-900">
                  <strong>Совет:</strong> Приложение P9 будет работать как полноценное Android приложение!
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;