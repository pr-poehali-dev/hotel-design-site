import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FizzyButton } from '@/components/ui/fizzy-button';
import Icon from '@/components/ui/icon';
import { BookingRecord } from '@/types/booking';

interface BookingDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (booking: BookingRecord) => void;
  booking?: BookingRecord;
}

const BookingDialog = ({ open, onClose, onSave, booking }: BookingDialogProps) => {
  const [formData, setFormData] = useState<Partial<BookingRecord>>({
    checkIn: '',
    checkOut: '',
    earlyCheckIn: 0,
    lateCheckOut: 0,
    parking: 0,
    accommodationAmount: 0,
    aggregatorCommission: 0,
    maid: 2000,
    laundry: 500,
    hygiene: 0,
    transport: 0,
    compliment: 500,
    other: 0,
    otherNote: '',
  });

  useEffect(() => {
    if (booking) {
      setFormData(booking);
    }
  }, [booking]);

  const calculateFields = () => {
    const totalAmount = 
      (formData.accommodationAmount || 0) + 
      (formData.earlyCheckIn || 0) + 
      (formData.lateCheckOut || 0) + 
      (formData.parking || 0);
    
    const aggregatorCommissionAmount = totalAmount * ((formData.aggregatorCommission || 0) / 100);
    const taxAndBankCommission = totalAmount * 0.07; // 7% УСН и комиссия банка
    const remainderBeforeManagement = totalAmount - aggregatorCommissionAmount;
    const managementCommission = remainderBeforeManagement * 0.20; // 20% комиссия управления
    const remainderBeforeExpenses = remainderBeforeManagement - managementCommission;
    
    const operatingExpenses = 
      (formData.maid || 0) + 
      (formData.laundry || 0) + 
      (formData.hygiene || 0) + 
      (formData.transport || 0) + 
      (formData.compliment || 0) + 
      (formData.other || 0);
    
    const ownerFunds = remainderBeforeExpenses - operatingExpenses;

    return {
      totalAmount,
      taxAndBankCommission,
      remainderBeforeManagement,
      managementCommission,
      remainderBeforeExpenses,
      operatingExpenses,
      ownerFunds,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculated = calculateFields();
    
    const newBooking: BookingRecord = {
      id: booking?.id || Date.now().toString(),
      checkIn: formData.checkIn || '',
      checkOut: formData.checkOut || '',
      earlyCheckIn: formData.earlyCheckIn || 0,
      lateCheckOut: formData.lateCheckOut || 0,
      parking: formData.parking || 0,
      accommodationAmount: formData.accommodationAmount || 0,
      totalAmount: calculated.totalAmount,
      aggregatorCommission: formData.aggregatorCommission || 0,
      taxAndBankCommission: calculated.taxAndBankCommission,
      remainderBeforeManagement: calculated.remainderBeforeManagement,
      managementCommission: calculated.managementCommission,
      remainderBeforeExpenses: calculated.remainderBeforeExpenses,
      operatingExpenses: calculated.operatingExpenses,
      ownerFunds: calculated.ownerFunds,
      paymentToOwner: 0,
      paymentDate: '',
      maid: formData.maid || 0,
      laundry: formData.laundry || 0,
      hygiene: formData.hygiene || 0,
      transport: formData.transport || 0,
      compliment: formData.compliment || 0,
      other: formData.other || 0,
      otherNote: formData.otherNote || '',
    };

    onSave(newBooking);
    onClose();
  };

  const calculated = calculateFields();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playfair font-bold text-charcoal-900">
            {booking ? 'Редактировать бронирование' : 'Добавить бронирование'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-charcoal-900 font-inter flex items-center gap-2">
                <Icon name="Calendar" size={18} />
                Основная информация
              </h3>
              
              <div>
                <label className="block text-sm font-semibold text-charcoal-700 mb-1">Заселение</label>
                <input
                  type="date"
                  value={formData.checkIn}
                  onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                  className="w-full px-4 py-2 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal-700 mb-1">Выезд</label>
                <input
                  type="date"
                  value={formData.checkOut}
                  onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                  className="w-full px-4 py-2 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal-700 mb-1">Сумма проживания ₽</label>
                <input
                  type="number"
                  value={formData.accommodationAmount}
                  onChange={(e) => setFormData({...formData, accommodationAmount: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-1">Ранний заезд ₽</label>
                  <input
                    type="number"
                    value={formData.earlyCheckIn}
                    onChange={(e) => setFormData({...formData, earlyCheckIn: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-1">Поздний выезд ₽</label>
                  <input
                    type="number"
                    value={formData.lateCheckOut}
                    onChange={(e) => setFormData({...formData, lateCheckOut: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-1">Паркинг ₽</label>
                  <input
                    type="number"
                    value={formData.parking}
                    onChange={(e) => setFormData({...formData, parking: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal-700 mb-1">Комиссия агрегатора %</label>
                <select
                  value={formData.aggregatorCommission}
                  onChange={(e) => setFormData({...formData, aggregatorCommission: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                >
                  <option value={0}>0% (прямая бронь)</option>
                  <option value={15}>15%</option>
                  <option value={25}>25%</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-charcoal-900 font-inter flex items-center gap-2">
                <Icon name="Wallet" size={18} />
                Затраты на эксплуатацию
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-1">Горничная ₽</label>
                  <input
                    type="number"
                    value={formData.maid}
                    onChange={(e) => setFormData({...formData, maid: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-1">Прачка ₽</label>
                  <input
                    type="number"
                    value={formData.laundry}
                    onChange={(e) => setFormData({...formData, laundry: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-1">Ср-ва гигиены ₽</label>
                  <input
                    type="number"
                    value={formData.hygiene}
                    onChange={(e) => setFormData({...formData, hygiene: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-1">Транспортные ₽</label>
                  <input
                    type="number"
                    value={formData.transport}
                    onChange={(e) => setFormData({...formData, transport: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-1">Комплимент ₽</label>
                  <input
                    type="number"
                    value={formData.compliment}
                    onChange={(e) => setFormData({...formData, compliment: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-1">Прочие ₽</label>
                  <input
                    type="number"
                    value={formData.other}
                    onChange={(e) => setFormData({...formData, other: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal-700 mb-1">Примечание к прочим</label>
                <textarea
                  value={formData.otherNote}
                  onChange={(e) => setFormData({...formData, otherNote: e.target.value})}
                  className="w-full px-4 py-2 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                  rows={3}
                />
              </div>

              <div className="bg-gradient-to-br from-gold-50 to-white border-2 border-gold-300 rounded-lg p-4 space-y-2">
                <h4 className="font-bold text-charcoal-900 flex items-center gap-2">
                  <Icon name="Calculator" size={16} />
                  Автоматические расчеты
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-charcoal-600">Итоговая сумма:</span>
                    <p className="font-bold text-charcoal-900">{calculated.totalAmount.toLocaleString('ru')} ₽</p>
                  </div>
                  <div>
                    <span className="text-charcoal-600">Комис. управление:</span>
                    <p className="font-bold text-charcoal-900">{calculated.managementCommission.toLocaleString('ru')} ₽</p>
                  </div>
                  <div>
                    <span className="text-charcoal-600">Затраты:</span>
                    <p className="font-bold text-orange-600">{calculated.operatingExpenses.toLocaleString('ru')} ₽</p>
                  </div>
                  <div className="col-span-2 pt-2 border-t-2 border-gold-300">
                    <span className="text-charcoal-600">Средства собственнику:</span>
                    <p className="font-bold text-2xl text-green-600">{calculated.ownerFunds.toLocaleString('ru')} ₽</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <FizzyButton
              type="button"
              onClick={onClose}
              variant="secondary"
            >
              Отмена
            </FizzyButton>
            <FizzyButton
              type="submit"
              icon={<Icon name="Save" size={18} />}
            >
              Сохранить
            </FizzyButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
