import { useState } from 'react';
import Icon from '@/components/ui/icon';

const BACKEND_URL = 'https://functions.poehali.dev/be4ae96b-1632-41de-99c3-c942febf4b4d';

const FortuneWheelPage = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [showQRInfo, setShowQRInfo] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');
  const [guestName, setGuestName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const prizes = [
    { label: '5%', color: 'from-blue-400 to-blue-600', angle: 0 },
    { label: '10%', color: 'from-green-400 to-green-600', angle: 45 },
    { label: '15%', color: 'from-yellow-400 to-yellow-600', angle: 90 },
    { label: '20%', color: 'from-orange-400 to-orange-600', angle: 135 },
    { label: '25%', color: 'from-red-400 to-red-600', angle: 180 },
    { label: '30%', color: 'from-purple-400 to-purple-600', angle: 225 },
    { label: '40%', color: 'from-pink-400 to-pink-600', angle: 270 },
    { label: '50%', color: 'from-gold-400 to-gold-600', angle: 315 },
  ];

  const handleSpin = async () => {
    if (isSpinning) return;
    
    if (!guestEmail) {
      setError('Пожалуйста, укажите email');
      return;
    }

    setIsSpinning(true);
    setResult(null);
    setPromoCode(null);
    setError(null);

    const spins = 5;
    const randomDegree = Math.floor(Math.random() * 360);
    const totalRotation = spins * 360 + randomDegree;
    
    setRotation(totalRotation);

    setTimeout(async () => {
      setIsSpinning(false);
      const finalAngle = totalRotation % 360;
      const prizeIndex = Math.floor((360 - finalAngle + 22.5) / 45) % 8;
      const discountPercent = parseInt(prizes[prizeIndex].label);
      setResult(prizes[prizeIndex].label);
      
      try {
        const response = await fetch(BACKEND_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            guest_email: guestEmail,
            guest_name: guestName,
            discount_percent: discountPercent,
            booking_id: null
          })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          setPromoCode(data.promo_code);
        } else {
          setError(data.error || 'Ошибка сохранения результата');
        }
      } catch (err) {
        console.error('Error saving spin result:', err);
        setError('Не удалось сохранить результат');
      }
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-gold-50">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <a 
              href="/" 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-gold-200 to-gold-400 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-playfair font-bold text-charcoal-900">P9</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold-300 rounded-full opacity-80"></div>
              </div>
              <span className="font-playfair font-bold text-white text-xs">Premium Apartments</span>
            </a>
            <div className="border-l border-white/30 pl-4 ml-2">
              <h1 className="text-3xl font-bold font-playfair flex items-center gap-3">
                <Icon name="Disc3" size={32} />
                Колесо фортуны
              </h1>
              <p className="text-white/90 text-sm">Крутите и выигрывайте скидки до 50%!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-playfair font-bold text-charcoal-900 mb-2">
                Испытайте удачу!
              </h2>
              <p className="text-gray-600">
                Вращайте колесо и получите персональную скидку
              </p>
            </div>

            <div className="mb-6 space-y-3">
              <div>
                <label className="block text-sm font-semibold text-charcoal-900 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-gold-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal-900 mb-1">
                  Имя (необязательно)
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Ваше имя"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-gold-500 focus:outline-none"
                />
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>

            <div className="relative w-80 h-80 mx-auto mb-8">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20">
                <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-red-600 drop-shadow-lg"></div>
              </div>

              <div 
                className="relative w-full h-full rounded-full shadow-2xl transition-transform duration-[4000ms] ease-out"
                style={{ 
                  transform: `rotate(${rotation}deg)`,
                  background: 'conic-gradient(from 0deg, #3b82f6 0deg 45deg, #10b981 45deg 90deg, #eab308 90deg 135deg, #f97316 135deg 180deg, #ef4444 180deg 225deg, #a855f7 225deg 270deg, #ec4899 270deg 315deg, #f59e0b 315deg 360deg)'
                }}
              >
                <div className="absolute inset-0 rounded-full" style={{
                  background: 'repeating-conic-gradient(from 0deg, transparent 0deg 44deg, rgba(0,0,0,0.1) 44deg 45deg)'
                }}></div>

                {prizes.map((prize, index) => (
                  <div
                    key={index}
                    className="absolute top-1/2 left-1/2 origin-left"
                    style={{
                      transform: `rotate(${prize.angle + 22.5}deg) translateX(80px)`,
                    }}
                  >
                    <div className="bg-white text-charcoal-900 font-bold text-xl px-3 py-1 rounded-lg shadow-lg -translate-x-1/2 -translate-y-1/2">
                      {prize.label}
                    </div>
                  </div>
                ))}

                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={handleSpin}
                    disabled={isSpinning}
                    className="w-20 h-20 bg-white rounded-full shadow-xl flex items-center justify-center font-bold text-charcoal-900 hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed border-4 border-gold-400"
                  >
                    {isSpinning ? <Icon name="Loader" className="animate-spin" size={32} /> : 'SPIN'}
                  </button>
                </div>
              </div>
            </div>

            {result && promoCode && (
              <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-2xl p-6 text-center animate-bounce">
                <Icon name="Trophy" size={48} className="mx-auto mb-3" />
                <h3 className="text-3xl font-playfair font-bold mb-2">Поздравляем!</h3>
                <p className="text-2xl font-bold mb-3">Вы выиграли скидку {result}!</p>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 inline-block">
                  <p className="text-xs uppercase tracking-wider mb-1 text-white/80">Ваш промокод:</p>
                  <p className="text-2xl font-mono font-bold">{promoCode}</p>
                </div>
                <p className="text-sm mt-3 text-white/90">Промокод также отправлен на {guestEmail}</p>
                <p className="text-xs mt-1 text-white/70">Действителен 180 дней</p>
              </div>
            )}

            <div className="text-center mt-6 space-y-3">
              <a
                href="/my-promo-codes"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
              >
                <Icon name="Ticket" size={20} />
                Посмотреть мои промокоды
              </a>
              <div>
                <button
                  onClick={() => setShowQRInfo(!showQRInfo)}
                  className="text-gold-600 font-semibold hover:text-gold-700 flex items-center gap-2 mx-auto"
                >
                  <Icon name="QrCode" size={20} />
                  Как получить доступ к колесу?
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-gradient-to-br from-gold-50 to-gold-100 rounded-2xl p-8 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center">
                  <Icon name="Info" size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-playfair font-bold text-charcoal-900">
                  Как это работает?
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-charcoal-900 mb-1">Заселитесь в апартаменты</h4>
                    <p className="text-gray-600 text-sm">
                      При заезде администратор передаст вам специальную карточку с QR-кодом
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-charcoal-900 mb-1">Отсканируйте QR-код</h4>
                    <p className="text-gray-600 text-sm">
                      Используйте камеру вашего телефона для сканирования кода. Вы попадете на эту страницу
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-charcoal-900 mb-1">Крутите колесо</h4>
                    <p className="text-gray-600 text-sm">
                      Нажмите кнопку SPIN и наблюдайте за вращением колеса фортуны!
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-charcoal-900 mb-1">Получите промокод</h4>
                    <p className="text-gray-600 text-sm">
                      Скидка от 5% до 50% автоматически придет на email, указанный при бронировании
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <h4 className="font-bold text-charcoal-900 mb-1">Используйте при следующем бронировании</h4>
                    <p className="text-gray-600 text-sm">
                      Промокод действителен 6 месяцев и применяется к любым апартаментам
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Icon name="AlertCircle" size={24} className="text-gold-600" />
                <h3 className="text-xl font-playfair font-bold text-charcoal-900">
                  Важные условия
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={16} className="text-green-600 mt-1 flex-shrink-0" />
                  <span>Каждый гость может крутить колесо <strong>один раз за бронирование</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={16} className="text-green-600 mt-1 flex-shrink-0" />
                  <span>Промокод действует <strong>180 дней</strong> с момента получения</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={16} className="text-green-600 mt-1 flex-shrink-0" />
                  <span>Скидка применяется к <strong>полной стоимости</strong> бронирования</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={16} className="text-green-600 mt-1 flex-shrink-0" />
                  <span>Промокод <strong>не суммируется</strong> с другими акциями</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={16} className="text-green-600 mt-1 flex-shrink-0" />
                  <span>Минимальный срок бронирования — <strong>2 ночи</strong></span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6 text-center">
              <Icon name="Gift" size={40} className="mx-auto mb-3" />
              <h3 className="text-xl font-playfair font-bold mb-2">Бонус для постоянных гостей!</h3>
              <p className="text-sm text-white/90">
                При каждом 5-м бронировании вы получаете дополнительное вращение колеса с гарантированной скидкой от 25%!
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-playfair font-bold text-charcoal-900 mb-6 text-center">
            Часто задаваемые вопросы
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-charcoal-900 mb-2 flex items-center gap-2">
                <Icon name="HelpCircle" size={20} className="text-gold-600" />
                Можно ли передать промокод другу?
              </h4>
              <p className="text-gray-600 text-sm">
                Нет, промокод персональный и привязан к email гостя. Но вы можете посоветовать другу забронировать и получить свой промокод!
              </p>
            </div>
            <div>
              <h4 className="font-bold text-charcoal-900 mb-2 flex items-center gap-2">
                <Icon name="HelpCircle" size={20} className="text-gold-600" />
                Что если я забыл промокод?
              </h4>
              <p className="text-gray-600 text-sm">
                Не беспокойтесь! Промокод всегда доступен в вашем личном кабинете в разделе "Мои промокоды".
              </p>
            </div>
            <div>
              <h4 className="font-bold text-charcoal-900 mb-2 flex items-center gap-2">
                <Icon name="HelpCircle" size={20} className="text-gold-600" />
                Можно ли использовать несколько промокодов?
              </h4>
              <p className="text-gray-600 text-sm">
                К одному бронированию применяется только один промокод с наибольшей скидкой.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-charcoal-900 mb-2 flex items-center gap-2">
                <Icon name="HelpCircle" size={20} className="text-gold-600" />
                Есть ли ограничения по датам?
              </h4>
              <p className="text-gray-600 text-sm">
                Промокод действует круглый год, включая праздничные дни. Исключения могут быть только в период 31 декабря - 2 января.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-shadow"
          >
            <Icon name="ArrowLeft" size={20} />
            Вернуться на главную
          </a>
        </div>
      </div>
    </div>
  );
};

export default FortuneWheelPage;