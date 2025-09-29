import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const BookingSection = () => {
  return (
    <section className="py-20 min-h-screen bg-gradient-to-br from-charcoal-50 to-gold-50">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-playfair font-bold text-charcoal-900 mb-4">
              <span className="text-gold-500">Бронирование</span> Апартаментов
            </h2>
            <p className="text-xl text-charcoal-600 font-inter">
              Забронируйте ваши идеальные апартаменты прямо сейчас
            </p>
          </div>

          <Card className="p-8 shadow-2xl border-0 bg-white">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-charcoal-700 font-semibold mb-2 font-inter">Дата заезда</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-charcoal-700 font-semibold mb-2 font-inter">Дата выезда</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-charcoal-700 font-semibold mb-2 font-inter">Тип апартаментов</label>
                <select className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all">
                  <option>Стандартные апартаменты - 8 500 ₽</option>
                  <option>Люкс апартаменты - 15 000 ₽</option>
                  <option>Президентские апартаменты - 35 000 ₽</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-charcoal-700 font-semibold mb-2 font-inter">Взрослые</label>
                  <select className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-charcoal-700 font-semibold mb-2 font-inter">Дети</label>
                  <select className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all">
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-charcoal-700 font-semibold mb-2 font-inter">Имя</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all"
                  placeholder="Ваше полное имя"
                />
              </div>

              <div>
                <label className="block text-charcoal-700 font-semibold mb-2 font-inter">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-charcoal-700 font-semibold mb-2 font-inter">Телефон</label>
                <input 
                  type="tel" 
                  className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>

              <Button className="w-full bg-gold-500 hover:bg-gold-600 text-charcoal-900 font-bold py-4 text-lg">
                Забронировать апартаменты
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;