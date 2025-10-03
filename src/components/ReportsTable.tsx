import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { FizzyButton } from '@/components/ui/fizzy-button';
import Icon from '@/components/ui/icon';
import { BookingRecord } from '@/types/booking';
import * as XLSX from 'xlsx';

interface ReportsTableProps {
  bookings: BookingRecord[];
  onAddBooking?: () => void;
  onEditBooking?: (booking: BookingRecord) => void;
  onDeleteBooking?: (id: string) => void;
  onSendReport?: (booking: BookingRecord) => void;
  readOnly?: boolean;
  managementCommissionRate?: number;
  onCommissionRateChange?: (rate: number) => void;
}

const ReportsTable = ({ 
  bookings, 
  onAddBooking, 
  onEditBooking, 
  onDeleteBooking, 
  onSendReport, 
  readOnly = false,
  managementCommissionRate = 20,
  onCommissionRateChange
}: ReportsTableProps) => {
  
  const recalculateBooking = (booking: BookingRecord, rate: number) => {
    const commissionAmount = Math.round(booking.remainderBeforeManagement * (rate / 100));
    const remainderBeforeExpenses = booking.remainderBeforeManagement - commissionAmount;
    const ownerFunds = remainderBeforeExpenses - booking.operatingExpenses;
    
    return {
      ...booking,
      managementCommission: commissionAmount,
      remainderBeforeExpenses,
      ownerFunds
    };
  };

  const recalculatedBookings = bookings.map(b => recalculateBooking(b, managementCommissionRate));

  const calculateTotals = () => {
    return recalculatedBookings.reduce((acc, booking) => ({
      totalAmount: acc.totalAmount + booking.totalAmount,
      ownerFunds: acc.ownerFunds + booking.ownerFunds,
      operatingExpenses: acc.operatingExpenses + booking.operatingExpenses,
      managementCommission: acc.managementCommission + booking.managementCommission,
      maid: acc.maid + booking.maid,
      laundry: acc.laundry + booking.laundry,
      hygiene: acc.hygiene + booking.hygiene,
      transport: acc.transport + booking.transport,
      compliment: acc.compliment + booking.compliment,
      other: acc.other + booking.other,
    }), {
      totalAmount: 0,
      ownerFunds: 0,
      operatingExpenses: 0,
      managementCommission: 0,
      maid: 0,
      laundry: 0,
      hygiene: 0,
      transport: 0,
      compliment: 0,
      other: 0,
    });
  };

  const exportToExcel = () => {
    const exportData = recalculatedBookings.map(b => ({
      'Заселение': b.checkIn,
      'Выезд': b.checkOut,
      'Ранний заезд': b.earlyCheckIn,
      'Поздний выезд': b.lateCheckOut,
      'Паркинг': b.parking,
      'Сумма проживания': b.accommodationAmount,
      'Итоговая сумма': b.totalAmount,
      'Комиссия агрегатора %': b.aggregatorCommission,
      'УСН и комисс банка': b.taxAndBankCommission,
      'Остаток до комиссии': b.remainderBeforeManagement,
      [`Комиссия управление ${managementCommissionRate}%`]: b.managementCommission,
      'Остаток до затрат': b.remainderBeforeExpenses,
      'Затраты на эксплуатацию': b.operatingExpenses,
      'Средства для собственника': b.ownerFunds,
      'Горничная': b.maid,
      'Прачка': b.laundry,
      'Ср-ва гигиены': b.hygiene,
      'Транспортные': b.transport,
      'Комплимент': b.compliment,
      'Прочие': b.other,
      'Примечание': b.otherNote,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Отчет');
    XLSX.writeFile(wb, `Отчет_${new Date().toLocaleDateString('ru')}.xlsx`);
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-playfair font-bold text-charcoal-900">
          Отчетность по бронированиям
        </h2>
        <div className="flex gap-3 items-center">
          {onCommissionRateChange && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-inter text-charcoal-700">Комиссия управления:</label>
              <select
                value={managementCommissionRate}
                onChange={(e) => onCommissionRateChange(Number(e.target.value))}
                className="px-3 py-2 border border-charcoal-300 rounded-lg bg-white text-charcoal-900 font-inter text-sm focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
              >
                <option value={0}>0%</option>
                <option value={15}>15%</option>
                <option value={20}>20%</option>
                <option value={25}>25%</option>
              </select>
            </div>
          )}
          {!readOnly && onAddBooking && <div className="flex gap-3">
            <FizzyButton
              onClick={exportToExcel}
              variant="secondary"
              icon={<Icon name="Download" size={18} />}
            >
              Экспорт в Excel
            </FizzyButton>
            <FizzyButton
              onClick={onAddBooking}
              icon={<Icon name="Plus" size={18} />}
            >
              Добавить бронь
            </FizzyButton>
          </div>}
        </div>
      </div>

      <Card className="p-6 bg-gradient-to-br from-gold-50 to-white border-gold-200">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-charcoal-600 font-inter">Общая сумма</p>
            <p className="text-2xl font-bold text-charcoal-900">{totals.totalAmount.toLocaleString('ru')} ₽</p>
          </div>
          <div>
            <p className="text-sm text-charcoal-600 font-inter">Средства собственнику</p>
            <p className="text-2xl font-bold text-green-600">{totals.ownerFunds.toLocaleString('ru')} ₽</p>
          </div>
          <div>
            <p className="text-sm text-charcoal-600 font-inter">Затраты на эксплуатацию</p>
            <p className="text-2xl font-bold text-orange-600">{totals.operatingExpenses.toLocaleString('ru')} ₽</p>
          </div>
          <div>
            <p className="text-sm text-charcoal-600 font-inter">Количество броней</p>
            <p className="text-2xl font-bold text-charcoal-900">{bookings.length}</p>
          </div>
        </div>
      </Card>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-charcoal-800 to-charcoal-900 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Заселение</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Выезд</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Ранний заезд</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Поздний выезд</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Паркинг</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Сумма проживания</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Итого</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Комис. агрег. %</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Остаток до упр.</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Комис. упр. {managementCommissionRate}%</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Затраты эксп.</th>
              <th className="px-4 py-3 text-right text-sm font-semibold bg-gold-600">Собственнику</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody>
            {recalculatedBookings.map((booking, index) => (
              <tr 
                key={booking.id}
                className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} ${!readOnly ? 'hover:bg-gold-50 cursor-pointer' : ''} transition-colors`}
                onClick={() => !readOnly && onEditBooking?.(bookings[index])}
              >
                <td className="px-4 py-3 text-sm">{booking.checkIn}</td>
                <td className="px-4 py-3 text-sm">{booking.checkOut}</td>
                <td className="px-4 py-3 text-sm text-right">{booking.earlyCheckIn.toLocaleString('ru')}</td>
                <td className="px-4 py-3 text-sm text-right">{booking.lateCheckOut.toLocaleString('ru')}</td>
                <td className="px-4 py-3 text-sm text-right">{booking.parking.toLocaleString('ru')}</td>
                <td className="px-4 py-3 text-sm text-right">{booking.accommodationAmount.toLocaleString('ru')}</td>
                <td className="px-4 py-3 text-sm text-right font-semibold">{booking.totalAmount.toLocaleString('ru')}</td>
                <td className="px-4 py-3 text-sm text-right">{booking.aggregatorCommission}%</td>
                <td className="px-4 py-3 text-sm text-right">{booking.remainderBeforeManagement.toLocaleString('ru')}</td>
                <td className="px-4 py-3 text-sm text-right">{booking.managementCommission.toLocaleString('ru')}</td>
                <td className="px-4 py-3 text-sm text-right text-orange-600">{booking.operatingExpenses.toLocaleString('ru')}</td>
                <td className="px-4 py-3 text-sm text-right font-bold text-green-600 bg-green-50">{booking.ownerFunds.toLocaleString('ru')}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex gap-2 justify-center items-center">
                    {!readOnly && booking.guestEmail && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSendReport?.(booking);
                        }}
                        className="text-gold-600 hover:text-gold-800 transition-colors"
                        title="Отправить отчет гостю"
                      >
                        <Icon name="Send" size={18} />
                      </button>
                    )}
                    {!readOnly && <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteBooking?.(booking.id);
                      }}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Icon name="Trash2" size={18} />
                    </button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gradient-to-r from-charcoal-800 to-charcoal-900 text-white font-bold">
            <tr>
              <td colSpan={6} className="px-4 py-4 text-right">ИТОГО:</td>
              <td className="px-4 py-4 text-right">{totals.totalAmount.toLocaleString('ru')} ₽</td>
              <td colSpan={3}></td>
              <td className="px-4 py-4 text-right">{totals.operatingExpenses.toLocaleString('ru')} ₽</td>
              <td className="px-4 py-4 text-right bg-gold-600">{totals.ownerFunds.toLocaleString('ru')} ₽</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ReportsTable;