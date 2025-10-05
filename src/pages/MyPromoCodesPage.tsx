import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const BACKEND_URL = 'https://functions.poehali.dev/be4ae96b-1632-41de-99c3-c942febf4b4d';

interface PromoCode {
  id: number;
  discount_percent: number;
  promo_code: string;
  spin_date: string;
  is_used: boolean;
  expiry_date: string;
  is_expired: boolean;
}

const MyPromoCodesPage = () => {
  const [email, setEmail] = useState('');
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!email) {
      setError('Введите email');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await fetch(`${BACKEND_URL}?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setPromoCodes(data.spins);
      } else {
        setError(data.error || 'Ошибка загрузки промокодов');
      }
    } catch (err) {
      console.error('Error loading promo codes:', err);
      setError('Не удалось загрузить промокоды');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusBadge = (promo: PromoCode) => {
    if (promo.is_expired) {
      return (
        <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Icon name="Clock" size={14} />
          Истёк
        </div>
      );
    }
    if (promo.is_used) {
      return (
        <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Icon name="CheckCircle" size={14} />
          Использован
        </div>
      );
    }
    return (
      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
        <Icon name="Sparkles" size={14} />
        Активен
      </div>
    );
  };

  const getDiscountColor = (percent: number) => {
    if (percent >= 40) return 'from-gold-400 to-gold-600';
    if (percent >= 25) return 'from-purple-400 to-purple-600';
    if (percent >= 15) return 'from-orange-400 to-orange-600';
    return 'from-blue-400 to-blue-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-white py-8 shadow-lg">
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
                <Icon name="Ticket" size={32} />
                Мои промокоды
              </h1>
              <p className="text-white/90 text-sm">История ваших выигрышей в колесе фортуны</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center">
              <Icon name="Search" size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-playfair font-bold text-charcoal-900">
                Найти мои промокоды
              </h2>
              <p className="text-gray-600 text-sm">
                Введите email, который вы указали при вращении колеса
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gold-500 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-gradient-to-r from-gold-500 to-gold-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Icon name="Loader" className="animate-spin" size={20} />
                  Поиск...
                </>
              ) : (
                <>
                  <Icon name="Search" size={20} />
                  Найти
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <Icon name="AlertCircle" size={20} />
              {error}
            </div>
          )}
        </div>

        {searched && !loading && promoCodes.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Icon name="Inbox" size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-playfair font-bold text-charcoal-900 mb-2">
              Промокоды не найдены
            </h3>
            <p className="text-gray-600 mb-6">
              По адресу {email} нет сохранённых промокодов
            </p>
            <a
              href="/fortune-wheel"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              <Icon name="Disc3" size={20} />
              Крутить колесо фортуны
            </a>
          </div>
        )}

        {promoCodes.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="Gift" size={24} className="text-gold-600" />
                <h3 className="text-xl font-bold text-charcoal-900">
                  Найдено промокодов: {promoCodes.length}
                </h3>
              </div>
              <div className="text-sm text-gray-600">
                Email: <span className="font-semibold">{email}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {promoCodes.map((promo) => (
                <div
                  key={promo.id}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 transition-all ${
                    promo.is_expired || promo.is_used
                      ? 'border-gray-200 opacity-75'
                      : 'border-gold-300 hover:shadow-2xl hover:scale-105'
                  }`}
                >
                  <div className={`h-3 bg-gradient-to-r ${getDiscountColor(promo.discount_percent)}`}></div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-20 h-20 bg-gradient-to-br ${getDiscountColor(promo.discount_percent)} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-white">{promo.discount_percent}%</div>
                          <div className="text-xs text-white/80 uppercase">скидка</div>
                        </div>
                      </div>
                      {getStatusBadge(promo)}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Промокод</p>
                          <p className="text-xl font-mono font-bold text-charcoal-900">{promo.promo_code}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(promo.promo_code)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Скопировать"
                        >
                          <Icon name="Copy" size={20} className="text-gray-600" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Icon name="Calendar" size={16} />
                        <span>Получен: {formatDate(promo.spin_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Icon name="Clock" size={16} />
                        <span>
                          Действует до: {formatDate(promo.expiry_date)}
                          {!promo.is_expired && !promo.is_used && (
                            <span className="ml-2 text-green-600 font-semibold">
                              (ещё {Math.ceil((new Date(promo.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} дней)
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    {!promo.is_expired && !promo.is_used && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <a
                          href="/"
                          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow"
                        >
                          <Icon name="Sparkles" size={18} />
                          Использовать при бронировании
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 text-center">
              <Icon name="Gift" size={48} className="text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-playfair font-bold text-charcoal-900 mb-2">
                Хотите больше скидок?
              </h3>
              <p className="text-gray-700 mb-4">
                Крутите колесо фортуны при каждом бронировании!
              </p>
              <a
                href="/fortune-wheel"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
              >
                <Icon name="Disc3" size={20} />
                Крутить колесо сейчас
              </a>
            </div>
          </>
        )}

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-gold-600 font-semibold hover:text-gold-700"
          >
            <Icon name="ArrowLeft" size={20} />
            Вернуться на главную
          </a>
        </div>
      </div>
    </div>
  );
};

export default MyPromoCodesPage;
