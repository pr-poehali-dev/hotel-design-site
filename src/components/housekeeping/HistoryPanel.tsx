import { useState } from 'react';
import { FizzyButton } from '@/components/ui/fizzy-button';
import Icon from '@/components/ui/icon';
import { Room } from './types';
import { getStatusColor, getStatusText } from './utils';

interface HistoryEntry {
  date: string;
  rooms: Room[];
}

interface HistoryPanelProps {
  history: HistoryEntry[];
  onLoadHistory: (entry: HistoryEntry) => void;
  onDeleteHistory: (date: string) => void;
}

const HistoryPanel = ({ history, onLoadHistory, onDeleteHistory }: HistoryPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const selectedEntry = history.find(h => h.date === selectedDate);

  return (
    <div className="mb-6">
      <FizzyButton
        onClick={() => setIsOpen(!isOpen)}
        icon={<Icon name="History" size={20} />}
        variant="secondary"
      >
        {isOpen ? 'Скрыть историю' : 'Показать историю'}
      </FizzyButton>

      {isOpen && (
        <div className="mt-4 bg-charcoal-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">История по дням</h3>
          
          {history.length === 0 ? (
            <p className="text-gray-400">История пока пуста</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Выберите дату</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {history.map((entry) => (
                    <div
                      key={entry.date}
                      className={`p-4 rounded-lg border transition-all cursor-pointer ${
                        selectedDate === entry.date
                          ? 'bg-gold-900/30 border-gold-500'
                          : 'bg-charcoal-700 border-gray-600 hover:border-gray-500'
                      }`}
                      onClick={() => setSelectedDate(entry.date)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-semibold">
                            {new Date(entry.date).toLocaleDateString('ru-RU', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            Апартаментов: {entry.rooms.length}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onLoadHistory(entry);
                              setIsOpen(false);
                            }}
                            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                            title="Загрузить"
                          >
                            <Icon name="Download" size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Удалить эту запись из истории?')) {
                                onDeleteHistory(entry.date);
                                if (selectedDate === entry.date) {
                                  setSelectedDate(null);
                                }
                              }
                            }}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            title="Удалить"
                          >
                            <Icon name="Trash2" size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedEntry && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">
                    Предпросмотр: {new Date(selectedEntry.date).toLocaleDateString('ru-RU')}
                  </h4>
                  <div className="bg-charcoal-700 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <div className="space-y-2">
                      {selectedEntry.rooms.map((room) => (
                        <div
                          key={room.id}
                          className="bg-charcoal-800 p-3 rounded-lg border border-gray-600"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {room.priority === 'high' && (
                                <Icon name="AlertCircle" size={16} className="text-red-500" />
                              )}
                              <span className="text-white font-semibold">{room.number}</span>
                              <span className="text-gray-400 text-sm">Этаж {room.floor}</span>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${getStatusColor(
                                room.status
                              )}`}
                            >
                              {getStatusText(room.status)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400 space-y-1">
                            {room.assignedTo && (
                              <p>
                                <Icon name="User" size={12} className="inline mr-1" />
                                {room.assignedTo}
                              </p>
                            )}
                            {room.checkOut && (
                              <p>
                                <Icon name="LogOut" size={12} className="inline mr-1" />
                                Выезд: {room.checkOut}
                              </p>
                            )}
                            {room.checkIn && (
                              <p>
                                <Icon name="LogIn" size={12} className="inline mr-1" />
                                Заезд: {room.checkIn}
                              </p>
                            )}
                            {room.notes && (
                              <p className="text-yellow-400">
                                <Icon name="MessageSquare" size={12} className="inline mr-1" />
                                {room.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
