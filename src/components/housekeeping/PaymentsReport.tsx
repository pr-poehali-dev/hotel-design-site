import { Room } from './types';
import Icon from '@/components/ui/icon';

interface PaymentsReportProps {
  rooms: Room[];
}

interface HousekeeperPayment {
  name: string;
  totalPaid: number;
  totalUnpaid: number;
  totalRooms: number;
  paidRooms: number;
  unpaidRooms: number;
}

const PaymentsReport = ({ rooms }: PaymentsReportProps) => {
  const calculatePaymentsByHousekeeper = (): HousekeeperPayment[] => {
    const paymentMap = new Map<string, HousekeeperPayment>();

    rooms.forEach(room => {
      if (!room.assignedTo) return;

      const existing = paymentMap.get(room.assignedTo) || {
        name: room.assignedTo,
        totalPaid: 0,
        totalUnpaid: 0,
        totalRooms: 0,
        paidRooms: 0,
        unpaidRooms: 0,
      };

      const payment = room.payment || 0;
      
      if (room.paymentStatus === 'paid') {
        existing.totalPaid += payment;
        existing.paidRooms += 1;
      } else {
        existing.totalUnpaid += payment;
        existing.unpaidRooms += 1;
      }
      
      existing.totalRooms += 1;
      paymentMap.set(room.assignedTo, existing);
    });

    return Array.from(paymentMap.values()).sort((a, b) => 
      (b.totalPaid + b.totalUnpaid) - (a.totalPaid + a.totalUnpaid)
    );
  };

  const housekeeperPayments = calculatePaymentsByHousekeeper();

  const totalPaid = housekeeperPayments.reduce((sum, hk) => sum + hk.totalPaid, 0);
  const totalUnpaid = housekeeperPayments.reduce((sum, hk) => sum + hk.totalUnpaid, 0);
  const grandTotal = totalPaid + totalUnpaid;

  return (
    <div className="bg-charcoal-800 rounded-xl p-6 mb-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="Wallet" size={28} className="text-gold-500" />
        <h2 className="text-2xl font-bold text-white">Отчёт по выплатам</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-charcoal-900 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="CheckCircle2" size={20} className="text-green-500" />
            <span className="text-gray-400 text-sm">Выплачено</span>
          </div>
          <p className="text-3xl font-bold text-green-500">{totalPaid.toLocaleString()} ₽</p>
        </div>

        <div className="bg-charcoal-900 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="AlertCircle" size={20} className="text-red-500" />
            <span className="text-gray-400 text-sm">К оплате</span>
          </div>
          <p className="text-3xl font-bold text-red-500">{totalUnpaid.toLocaleString()} ₽</p>
        </div>

        <div className="bg-charcoal-900 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="DollarSign" size={20} className="text-gold-500" />
            <span className="text-gray-400 text-sm">Общая сумма</span>
          </div>
          <p className="text-3xl font-bold text-gold-500">{grandTotal.toLocaleString()} ₽</p>
        </div>
      </div>

      {housekeeperPayments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-charcoal-900">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Горничная</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Апартаментов</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Выплачено</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">К оплате</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Всего</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {housekeeperPayments.map((hk) => {
                const total = hk.totalPaid + hk.totalUnpaid;
                const paidPercent = total > 0 ? Math.round((hk.totalPaid / total) * 100) : 0;
                
                return (
                  <tr key={hk.name} className="hover:bg-charcoal-700 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Icon name="User" size={16} className="text-gray-400" />
                        <span className="text-white font-medium">{hk.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      <div className="text-sm">
                        <div className="font-semibold">{hk.totalRooms}</div>
                        <div className="text-xs text-gray-500">
                          {hk.paidRooms} оплачено • {hk.unpaidRooms} не оплачено
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-green-500 font-semibold">
                        {hk.totalPaid.toLocaleString()} ₽
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-red-500 font-semibold">
                        {hk.totalUnpaid.toLocaleString()} ₽
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-bold">
                        {total.toLocaleString()} ₽
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-charcoal-900 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 transition-all"
                              style={{ width: `${paidPercent}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">{paidPercent}%</span>
                        </div>
                        {hk.totalUnpaid > 0 && (
                          <span className="text-xs text-red-400 flex items-center gap-1">
                            <Icon name="AlertTriangle" size={12} />
                            Есть долг
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <Icon name="FileX" size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Нет данных по выплатам</p>
          <p className="text-gray-600 text-sm mt-2">Назначьте горничных на апартаменты и установите выплаты</p>
        </div>
      )}
    </div>
  );
};

export default PaymentsReport;
