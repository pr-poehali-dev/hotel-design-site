import { useState } from 'react';
import { CleaningRecord } from './types';
import Icon from '@/components/ui/icon';
import { FizzyButton } from '@/components/ui/fizzy-button';

interface AdminCleaningHistoryProps {
  records: CleaningRecord[];
  onUpdatePaymentStatus: (recordId: string, status: 'paid' | 'unpaid', paidAt?: string) => void;
  onDeleteRecord?: (recordId: string) => void;
}

const AdminCleaningHistory = ({ records, onUpdatePaymentStatus, onDeleteRecord }: AdminCleaningHistoryProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [filterHousekeeper, setFilterHousekeeper] = useState<string>('all');

  console.log('AdminCleaningHistory records:', records);

  const housekeepers = Array.from(new Set(records.map(r => r.housekeeperName))).sort();

  const filteredRecords = records.filter(record => {
    const statusMatch = filterStatus === 'all' || record.paymentStatus === filterStatus;
    const housekeeperMatch = filterHousekeeper === 'all' || record.housekeeperName === filterHousekeeper;
    return statusMatch && housekeeperMatch;
  }).sort((a, b) => new Date(b.cleanedAt).getTime() - new Date(a.cleanedAt).getTime());

  const totalEarned = filteredRecords.reduce((sum, r) => sum + r.payment, 0);
  const totalPaid = filteredRecords.filter(r => r.paymentStatus === 'paid').reduce((sum, r) => sum + r.payment, 0);
  const totalUnpaid = totalEarned - totalPaid;

  const handleTogglePayment = (record: CleaningRecord) => {
    if (record.paymentStatus === 'unpaid') {
      onUpdatePaymentStatus(record.id, 'paid', new Date().toISOString());
    } else {
      onUpdatePaymentStatus(record.id, 'unpaid', undefined);
    }
  };

  if (records.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gold-600/30 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="History" size={28} className="text-gold-500" />
          <h2 className="text-3xl font-playfair font-bold text-white">История уборок и выплаты</h2>
        </div>
        <div className="text-center py-12">
          <Icon name="ClipboardList" size={64} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">История уборок пока пуста</p>
          <p className="text-gray-500 text-sm">
            Записи будут появляться автоматически при переводе апартаментов в статус "Чистый"
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gold-600/30 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="History" size={28} className="text-gold-500" />
        <h2 className="text-3xl font-playfair font-bold text-white">История уборок и выплаты</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="DollarSign" size={20} className="text-blue-400" />
            <p className="text-sm text-gray-400">Всего к выплате</p>
          </div>
          <p className="text-2xl font-bold text-white">{totalEarned} ₽</p>
          <p className="text-xs text-gray-500 mt-1">{filteredRecords.length} уборок</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-green-700">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="CheckCircle" size={20} className="text-green-400" />
            <p className="text-sm text-gray-400">Выплачено</p>
          </div>
          <p className="text-2xl font-bold text-green-400">{totalPaid} ₽</p>
          <p className="text-xs text-gray-500 mt-1">
            {filteredRecords.filter(r => r.paymentStatus === 'paid').length} уборок
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-orange-700">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Clock" size={20} className="text-orange-400" />
            <p className="text-sm text-gray-400">Ожидает выплаты</p>
          </div>
          <p className="text-2xl font-bold text-orange-400">{totalUnpaid} ₽</p>
          <p className="text-xs text-gray-500 mt-1">
            {filteredRecords.filter(r => r.paymentStatus === 'unpaid').length} уборок
          </p>
        </div>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterStatus === 'all'
                ? 'bg-gold-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Все
          </button>
          <button
            onClick={() => setFilterStatus('unpaid')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterStatus === 'unpaid'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Не выплачено
          </button>
          <button
            onClick={() => setFilterStatus('paid')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterStatus === 'paid'
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Выплачено
          </button>
        </div>

        <select
          value={filterHousekeeper}
          onChange={(e) => setFilterHousekeeper(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-gold-500 focus:outline-none font-semibold"
        >
          <option value="all">Все горничные</option>
          {housekeepers.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Дата уборки</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Номер</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Горничная</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Сумма</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Статус</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Дата выплаты</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Действие</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  Нет записей по выбранным фильтрам
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => (
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
                  <td className="py-3 px-4 text-white">{record.housekeeperName}</td>
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
                        Ожидает
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-white text-sm">
                    {record.paidAt ? (
                      new Date(record.paidAt).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <FizzyButton
                        onClick={() => handleTogglePayment(record)}
                        variant={record.paymentStatus === 'paid' ? 'secondary' : 'primary'}
                        size="sm"
                        icon={<Icon name={record.paymentStatus === 'paid' ? 'X' : 'Check'} size={16} />}
                      >
                        {record.paymentStatus === 'paid' ? 'Отменить' : 'Выплатить'}
                      </FizzyButton>
                      {onDeleteRecord && (
                        <FizzyButton
                          onClick={() => {
                            if (window.confirm('Удалить эту запись из истории? Это действие нельзя отменить.')) {
                              onDeleteRecord(record.id);
                            }
                          }}
                          variant="secondary"
                          size="sm"
                          icon={<Icon name="Trash2" size={16} />}
                          className="!bg-red-600/20 hover:!bg-red-600/40 !text-red-400"
                        >
                          Удалить
                        </FizzyButton>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredRecords.length > 0 && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Выбрано записей:</p>
              <p className="text-white font-bold text-lg">{filteredRecords.length}</p>
            </div>
            <div>
              <p className="text-gray-400">Сумма по фильтру:</p>
              <p className="text-white font-bold text-lg">{totalEarned} ₽</p>
            </div>
            <div>
              <p className="text-gray-400">Осталось выплатить:</p>
              <p className="text-orange-400 font-bold text-lg">{totalUnpaid} ₽</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCleaningHistory;