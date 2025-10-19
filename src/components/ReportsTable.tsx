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
  onMarkAsPaid?: (booking: BookingRecord) => void;
  readOnly?: boolean;
  managementCommissionRate?: number;
}

const ReportsTable = ({ 
  bookings, 
  onAddBooking, 
  onEditBooking, 
  onDeleteBooking, 
  onSendReport,
  onMarkAsPaid,
  readOnly = false,
  managementCommissionRate = 20
}: ReportsTableProps) => {
  
  const recalculateBooking = (booking: BookingRecord, rate: number) => {
    const commissionAmount = Math.round(booking.remainderBeforeManagement * (rate / 100));
    const remainderBeforeExpenses = booking.remainderBeforeManagement - commissionAmount;
    const calculatedOwnerFunds = remainderBeforeExpenses - booking.operatingExpenses;
    
    return {
      ...booking,
      managementCommission: commissionAmount,
      remainderBeforeExpenses,
      ownerFunds: booking.ownerFunds > 0 ? booking.ownerFunds : calculatedOwnerFunds
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
      'Гость': b.guestName || '',
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
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-playfair font-bold text-charcoal-900">
          Отчетность по бронированиям
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {!readOnly && onAddBooking && <div className="flex gap-2 sm:gap-3">
            <FizzyButton
              onClick={exportToExcel}
              variant="secondary"
              icon={<Icon name="Download" size={16} />}
              className="text-xs md:text-sm px-3 py-2"
            >
              <span className="hidden sm:inline">Экспорт</span>
            </FizzyButton>
            <FizzyButton
              onClick={onAddBooking}
              icon={<Icon name="Plus" size={16} />}
              className="text-xs md:text-sm px-3 py-2"
            >
              <span className="hidden sm:inline">Добавить бронь</span>
              <span className="sm:hidden">Добавить</span>
            </FizzyButton>
          </div>}
        </div>
      </div>

      <Card className="p-4 md:p-6 bg-gradient-to-br from-gold-50 to-white border-gold-200">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          <div>
            <p className="text-xs md:text-sm text-charcoal-600 font-inter">Общая сумма</p>
            <p className="text-lg md:text-2xl font-bold text-charcoal-900">{totals.totalAmount.toLocaleString('ru')} ₽</p>
          </div>
          <div>
            <p className="text-xs md:text-sm text-charcoal-600 font-inter">Собственнику</p>
            <p className="text-lg md:text-2xl font-bold text-green-600">{totals.ownerFunds.toLocaleString('ru')} ₽</p>
          </div>
          <div>
            <p className="text-xs md:text-sm text-charcoal-600 font-inter">Затраты</p>
            <p className="text-lg md:text-2xl font-bold text-orange-600">{totals.operatingExpenses.toLocaleString('ru')} ₽</p>
          </div>
          <div>
            <p className="text-xs md:text-sm text-charcoal-600 font-inter">Броней</p>
            <p className="text-lg md:text-2xl font-bold text-charcoal-900">{bookings.length}</p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="text-xs md:text-sm text-charcoal-600 font-inter mb-2">Комиссия</p>
            <p className="text-lg md:text-2xl font-bold text-charcoal-900">{managementCommissionRate}%</p>
          </div>
        </div>
      </Card>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {recalculatedBookings.map((booking, index) => (
          <Card 
            key={booking.id}
            className="p-4 bg-white shadow-md hover:shadow-lg transition-shadow"
            onClick={() => !readOnly && onEditBooking?.(bookings[index])}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-charcoal-600 font-inter">Период</p>
                  <p className="text-sm font-semibold text-charcoal-900">{booking.checkIn} — {booking.checkOut}</p>
                </div>
                {!readOnly && (
                  <div className="flex gap-2">
                    {booking.guestEmail && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSendReport?.(booking);
                        }}
                        className="text-gold-600 hover:text-gold-800 transition-colors p-2"
                      >
                        <Icon name="Send" size={16} />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteBooking?.(booking.id);
                      }}
                      className="text-red-600 hover:text-red-800 transition-colors p-2"
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                <div>
                  <p className="text-xs text-charcoal-600">Сумма проживания</p>
                  <p className="text-sm font-semibold">{booking.accommodationAmount.toLocaleString('ru')} ₽</p>
                </div>
                <div>
                  <p className="text-xs text-charcoal-600">Паркинг</p>
                  <p className="text-sm font-semibold">{booking.parking.toLocaleString('ru')} ₽</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-charcoal-600">Итоговая сумма</p>
                  <p className="text-base font-bold text-charcoal-900">{booking.totalAmount.toLocaleString('ru')} ₽</p>
                </div>
                <div>
                  <p className="text-xs text-charcoal-600">Комиссия агрегатора</p>
                  <p className="text-sm">{booking.aggregatorCommission}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                <div>
                  <p className="text-xs text-charcoal-600">Комиссия управления</p>
                  <p className="text-sm font-semibold">{booking.managementCommission.toLocaleString('ru')} ₽</p>
                </div>
                <div>
                  <p className="text-xs text-charcoal-600">Затраты</p>
                  <p className="text-sm font-semibold text-orange-600">{booking.operatingExpenses.toLocaleString('ru')} ₽</p>
                </div>
              </div>

              <div className={`pt-2 border-t-2 border-gold-300 -mx-4 -mb-4 px-4 py-3 rounded-b-lg ${
                new Date(booking.checkIn) > new Date() ? 'bg-blue-50' : 'bg-green-50'
              }`}>
                <p className="text-xs text-charcoal-600 mb-1">Средства собственнику</p>
                <p className={`text-xl font-bold ${
                  new Date(booking.checkIn) > new Date() ? 'text-blue-600' : 'text-green-600'
                }`}>{booking.ownerFunds.toLocaleString('ru')} ₽</p>
                {new Date(booking.checkIn) > new Date() && (
                  <p className="text-xs text-blue-500 mt-1">Предстоящее бронирование</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-charcoal-800 to-charcoal-900 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Период</th>
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
            {recalculatedBookings.map((booking, index) => {
              const isUpcoming = new Date(booking.checkIn) > new Date();
              return (
              <tr 
                key={booking.id}
                className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} ${!readOnly ? 'hover:bg-gold-50 cursor-pointer' : ''} transition-colors`}
                onClick={() => !readOnly && onEditBooking?.(bookings[index])}
              >
                <td className="px-4 py-3 text-sm whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {booking.checkIn} — {booking.checkOut}
                    {isUpcoming && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Предстоящее</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-right">{booking.parking.toLocaleString('ru')}</td>
                <td className="px-4 py-3 text-sm text-right">{booking.accommodationAmount.toLocaleString('ru')}</td>
                <td className="px-4 py-3 text-sm text-right font-semibold">{booking.totalAmount.toLocaleString('ru')}</td>
                <td className="px-4 py-3 text-sm text-right">{booking.aggregatorCommission}%</td>
                <td className="px-4 py-3 text-sm text-right">{booking.remainderBeforeManagement.toLocaleString('ru')}</td>
                <td className="px-4 py-3 text-sm text-right">{booking.managementCommission.toLocaleString('ru')}</td>
                <td className="px-4 py-3 text-sm text-right text-orange-600">{booking.operatingExpenses.toLocaleString('ru')}</td>
                <td className={`px-4 py-3 text-sm text-right font-bold ${
                  isUpcoming ? 'text-blue-600 bg-blue-50' : 'text-green-600 bg-green-50'
                }`}>{booking.ownerFunds.toLocaleString('ru')}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex gap-2 justify-center items-center">
                    {!readOnly && booking.paymentStatus !== 'paid' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsPaid?.(bookings[index]);
                        }}
                        className="text-green-600 hover:text-green-800 transition-colors"
                        title="Отметить как оплачено"
                      >
                        <Icon name="CheckCircle" size={18} />
                      </button>
                    )}
                    {!readOnly && booking.paymentStatus === 'paid' && (
                      <span className="text-green-600 flex items-center gap-1 text-xs font-medium">
                        <Icon name="CheckCircle2" size={16} />
                        Оплачено
                      </span>
                    )}
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
              );
            })}
          </tbody>
          <tfoot className="bg-gradient-to-r from-charcoal-800 to-charcoal-900 text-white font-bold">
            <tr>
              <td colSpan={3} className="px-4 py-4 text-right">ИТОГО:</td>
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