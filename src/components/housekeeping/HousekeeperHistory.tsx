import { CleaningRecord } from './types';
import Icon from '@/components/ui/icon';
import { FizzyButton } from '@/components/ui/fizzy-button';

interface HousekeeperHistoryProps {
  records: CleaningRecord[];
  onMarkAsPaid?: (recordId: string) => void;
  isAdmin: boolean;
}

const HousekeeperHistory = ({ records, onMarkAsPaid, isAdmin }: HousekeeperHistoryProps) => {
  const totalEarned = records.reduce((sum, r) => sum + r.payment, 0);
  const totalPaid = records.filter(r => r.paymentStatus === 'paid').reduce((sum, r) => sum + r.payment, 0);
  const totalUnpaid = totalEarned - totalPaid;

  const sortedRecords = [...records].sort((a, b) => 
    new Date(b.cleanedAt).getTime() - new Date(a.cleanedAt).getTime()
  );

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gold-600/30 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="History" size={24} className="text-gold-500" />
        <h2 className="text-2xl font-playfair font-bold text-white">История уборок</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="DollarSign" size={20} className="text-blue-400" />
            <p className="text-sm text-gray-400">Всего заработано</p>
          </div>
          <p className="text-2xl font-bold text-white">{totalEarned} ₽</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-green-700">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="CheckCircle" size={20} className="text-green-400" />
            <p className="text-sm text-gray-400">Выплачено</p>
          </div>
          <p className="text-2xl font-bold text-green-400">{totalPaid} ₽</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-orange-700">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Clock" size={20} className="text-orange-400" />
            <p className="text-sm text-gray-400">К выплате</p>
          </div>
          <p className="text-2xl font-bold text-orange-400">{totalUnpaid} ₽</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Дата</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Номер</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Сумма</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Статус</th>
              {isAdmin && <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Действие</th>}
            </tr>
          </thead>
          <tbody>
            {sortedRecords.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} className="text-center py-8 text-gray-500">
                  Пока нет записей об уборках
                </td>
              </tr>
            ) : (
              sortedRecords.map((record) => (
                <tr key={record.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-3 px-4 text-white">
                    {new Date(record.cleanedAt).toLocaleString('ru-RU', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="py-3 px-4 text-white font-semibold">{record.roomNumber}</td>
                  <td className="py-3 px-4 text-white font-bold">{record.payment} ₽</td>
                  <td className="py-3 px-4">
                    {record.paymentStatus === 'paid' ? (
                      <span className="px-3 py-1 bg-green-600/20 text-green-400 text-xs rounded-full font-semibold flex items-center gap-1 w-fit">
                        <Icon name="CheckCircle" size={14} />
                        Выплачено
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-orange-600/20 text-orange-400 text-xs rounded-full font-semibold flex items-center gap-1 w-fit">
                        <Icon name="Clock" size={14} />
                        Не выплачено
                      </span>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="py-3 px-4">
                      {record.paymentStatus === 'unpaid' && onMarkAsPaid && (
                        <FizzyButton
                          onClick={() => onMarkAsPaid(record.id)}
                          variant="secondary"
                          size="sm"
                          icon={<Icon name="Check" size={16} />}
                        >
                          Выплачено
                        </FizzyButton>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HousekeeperHistory;
