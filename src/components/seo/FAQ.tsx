import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Где находятся апартаменты на Поклонной 9?",
    answer: "Апартаменты ENZO отель расположены в Москве по адресу ул. Поклонная, д. 9. Это в 5 минутах пешком от Парка Победы и в 7 минутах от метро Парк Победы. Рядом находится Крокус фитнес на Поклонной 9."
  },
  {
    question: "Можно ли снять апартаменты посуточно на Поклонной 9?",
    answer: "Да, мы предоставляем апартаменты на короткий срок и посуточную аренду на Поклонной 9. ENZO отель работает с гибкими условиями бронирования от 1 дня."
  },
  {
    question: "Как добраться до ENZO отеля на Поклонной 9?",
    answer: "До апартаментов на Поклонной 9 удобно добираться от метро Парк Победы (7 минут пешком). Также рядом остановки наземного транспорта. Адрес: Москва, ул. Поклонная 9."
  },
  {
    question: "Что находится рядом с отелем на Поклонной 9?",
    answer: "Рядом с апартаментами на Поклонной 9 расположены: Парк Победы, Крокус фитнес на Поклонной 9, метро Парк Победы, торговые центры и рестораны."
  },
  {
    question: "Какие удобства в апартаментах ENZO на Поклонной?",
    answer: "Апартаменты на короткий срок на Поклонной 9 оборудованы всем необходимым для комфортного проживания: кухня, Wi-Fi, бытовая техника. Посуточная аренда включает все удобства."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-charcoal-800 rounded-xl p-8 border border-gray-700" itemScope itemType="https://schema.org/FAQPage">
      <h2 className="text-3xl font-playfair text-gold-400 mb-6">
        Частые вопросы об апартаментах на Поклонной 9
      </h2>
      
      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div 
            key={index} 
            className="border border-gray-700 rounded-lg overflow-hidden"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between bg-charcoal-700 hover:bg-charcoal-600 transition-colors text-left"
            >
              <h3 className="font-semibold text-white" itemProp="name">
                {item.question}
              </h3>
              <Icon 
                name={openIndex === index ? "ChevronUp" : "ChevronDown"} 
                className="text-gold-400 flex-shrink-0"
                size={20}
              />
            </button>
            
            {openIndex === index && (
              <div 
                className="px-6 py-4 bg-charcoal-750 text-gray-300"
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <p itemProp="text">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gold-500/10 border border-gold-500/30 rounded-lg">
        <p className="text-sm text-gray-300">
          <strong className="text-gold-400">ENZO отель на Поклонной 9</strong> — 
          апартаменты посуточно в Москве рядом с Парком Победы. 
          Аренда на короткий срок с удобным расположением у метро Парк Победы 
          и Крокус фитнес на Поклонной 9.
        </p>
      </div>
    </section>
  );
};

export default FAQ;
