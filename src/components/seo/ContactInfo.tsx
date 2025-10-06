import Icon from '@/components/ui/icon';

const ContactInfo = () => {
  return (
    <section className="bg-charcoal-800 rounded-xl p-8 border border-gray-700">
      <h2 className="text-3xl font-playfair text-gold-400 mb-6">
        Контакты ENZO Отель
      </h2>
      
      <div className="space-y-4 text-gray-300">
        <div className="flex items-start gap-3" itemScope itemType="https://schema.org/PostalAddress">
          <Icon name="MapPin" className="text-gold-400 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-white mb-1">Адрес апартаментов</h3>
            <p itemProp="addressLocality">г. Москва</p>
            <p itemProp="streetAddress">ул. Поклонная, д. 9</p>
            <p className="text-sm text-gray-400 mt-1">
              Рядом с Парком Победы, метро Парк Победы
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Icon name="Phone" className="text-gold-400 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-white mb-1">Телефон для бронирования</h3>
            <a href="tel:+79141965172" className="text-gold-400 hover:text-gold-300 transition-colors text-lg font-semibold block">
              +7 (914) 196-51-72
            </a>
            <p className="text-sm text-gray-400 mt-1">
              Звоните для бронирования апартаментов на Поклонной 9
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Icon name="MessageCircle" className="text-green-400 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-white mb-1">WhatsApp</h3>
            <a 
              href="https://wa.me/79361414232" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 transition-colors text-lg font-semibold block"
            >
              +7 (936) 141-42-32
            </a>
            <p className="text-sm text-gray-400 mt-1">
              Пишите в WhatsApp для быстрой консультации
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Icon name="Dumbbell" className="text-gold-400 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-white mb-1">Поблизости</h3>
            <ul className="text-sm space-y-1">
              <li>• Крокус фитнес на Поклонной 9</li>
              <li>• Парк Победы (5 минут пешком)</li>
              <li>• Метро Парк Победы (7 минут)</li>
            </ul>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Icon name="Clock" className="text-gold-400 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-white mb-1">Формат аренды</h3>
            <p>Апартаменты на короткий срок</p>
            <p>Посуточная аренда на Поклонной 9</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-charcoal-700 rounded-lg">
          <p className="text-sm text-gray-400">
            <strong className="text-gold-400">ENZO отель</strong> на Поклонной 9 в Москве - 
            ваш выбор для комфортного проживания в районе Парка Победы. 
            Апартаменты посуточно рядом с метро Парк Победы и Крокус фитнес.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;