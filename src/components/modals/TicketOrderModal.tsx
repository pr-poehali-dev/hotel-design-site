import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface Activity {
  id: string;
  title: string;
  venue: string;
  dates: string;
  price: string;
}

interface TicketOrderModalProps {
  activity: Activity;
  isOpen: boolean;
  onClose: () => void;
}

const TicketOrderModal = ({ activity, isOpen, onClose }: TicketOrderModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    ticketCount: 1,
    date: '',
    comment: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setFormData({
          name: '',
          phone: '',
          email: '',
          ticketCount: 1,
          date: '',
          comment: ''
        });
      }, 2000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const totalPrice = parseInt(activity.price.replace(/\D/g, '')) * formData.ticketCount;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Ticket" size={24} />
                <h2 className="text-2xl font-playfair font-bold">Заказ билетов</h2>
              </div>
              <h3 className="text-lg font-semibold opacity-95">{activity.title}</h3>
              <p className="text-sm opacity-90 mt-1">
                <Icon name="MapPin" size={14} className="inline mr-1" />
                {activity.venue}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        {isSuccess ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="CheckCircle" size={48} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-playfair font-bold text-charcoal-900 mb-3">
              Заявка принята!
            </h3>
            <p className="text-gray-600 text-lg">
              Мы свяжемся с вами в ближайшее время для подтверждения заказа
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-semibold">Даты проведения:</span>
                <span className="text-charcoal-900 font-bold">{activity.dates}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-semibold">Цена билета:</span>
                <span className="text-charcoal-900 font-bold">{activity.price}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ваше имя *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  placeholder="Иван Иванов"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Телефон *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  placeholder="+7 (900) 123-45-67"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                placeholder="ivan@example.com"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Количество билетов *
                </label>
                <select
                  name="ticketCount"
                  value={formData.ticketCount}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'билет' : num < 5 ? 'билета' : 'билетов'}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Желаемая дата
                </label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  placeholder="Например: 15 октября"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Комментарий
              </label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
                placeholder="Дополнительные пожелания..."
              />
            </div>

            <div className="bg-gradient-to-r from-gold-50 to-gold-100 rounded-xl p-4 border-2 border-gold-200">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-700">Итого к оплате:</span>
                <span className="text-3xl font-bold text-charcoal-900">{totalPrice.toLocaleString()}₽</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Icon name="Loader2" size={20} className="animate-spin" />
                    Отправка...
                  </>
                ) : (
                  <>
                    <Icon name="Send" size={20} />
                    Заказать билеты
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              После отправки заявки наш менеджер свяжется с вами для подтверждения и оплаты
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default TicketOrderModal;
