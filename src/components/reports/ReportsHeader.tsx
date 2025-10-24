import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { FizzyButton } from '@/components/ui/fizzy-button';

interface Owner {
  apartmentId: string;
  ownerEmail: string;
  ownerName: string;
  commissionRate: number;
}

interface ReportsHeaderProps {
  owners: Owner[];
  selectedApartment: string;
  onApartmentChange: (apartmentId: string) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  monthlyReports: any[];
  loading: boolean;
  onShowAllToOwner: () => void;
  onArchiveMonth: () => void;
  onSyncBnovo: () => void;
  onLogout: () => void;
}

const ReportsHeader = ({
  owners,
  selectedApartment,
  onApartmentChange,
  selectedMonth,
  onMonthChange,
  monthlyReports,
  loading,
  onShowAllToOwner,
  onArchiveMonth,
  onSyncBnovo,
  onLogout
}: ReportsHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-charcoal-900 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 to-transparent"></div>
      <div className="container mx-auto px-6 py-6 relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div 
              className="relative cursor-pointer transition-transform hover:scale-105"
              onClick={() => navigate('/')}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-playfair font-bold text-charcoal-900">P9</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold-300 rounded-full opacity-80"></div>
            </div>
            <div>
              <h1 
                className="font-playfair font-bold text-2xl text-gold-400 cursor-pointer hover:text-gold-300 transition-colors"
                onClick={() => navigate('/')}
              >
                Premium Apartments
              </h1>
              <p className="text-sm text-gray-400 font-inter">Поклонная 9</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <select
              value={selectedApartment}
              onChange={(e) => onApartmentChange(e.target.value)}
              className="px-4 py-2 bg-charcoal-800 border border-gold-500/30 text-white rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 font-inter"
            >
              {owners.length === 0 ? (
                <option value="">Загрузка...</option>
              ) : (
                owners.map(owner => (
                  <option key={owner.apartmentId} value={owner.apartmentId}>
                    Апартамент {owner.apartmentId}
                  </option>
                ))
              )}
            </select>
            <select
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className="px-4 py-2 bg-charcoal-800 border border-gold-500/30 text-white rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 font-inter"
            >
              <option value="current">Текущий период</option>
              {monthlyReports.map(report => (
                <option key={report.reportMonth} value={report.reportMonth}>
                  {new Date(report.reportMonth + '-01').toLocaleDateString('ru', { year: 'numeric', month: 'long' })}
                </option>
              ))}
            </select>
            {selectedMonth === 'current' && (
              <>
                <FizzyButton
                  onClick={onSyncBnovo}
                  variant="secondary"
                  icon={<Icon name="RefreshCw" size={18} />}
                  disabled={loading}
                >
                  Синхронизация Bnovo
                </FizzyButton>
                <FizzyButton
                  onClick={onShowAllToOwner}
                  variant="secondary"
                  icon={<Icon name="Eye" size={18} />}
                  disabled={loading}
                >
                  Показать все инвестору
                </FizzyButton>
                <FizzyButton
                  onClick={onArchiveMonth}
                  variant="secondary"
                  icon={<Icon name="Archive" size={18} />}
                  disabled={loading}
                >
                  Архивировать прошлый месяц
                </FizzyButton>
              </>
            )}
            <FizzyButton
              onClick={() => navigate('/calendar')}
              variant="secondary"
              icon={<Icon name="Calendar" size={18} />}
            >
              Календарь
            </FizzyButton>
            <FizzyButton
              onClick={() => navigate('/')}
              variant="secondary"
              icon={<Icon name="Home" size={18} />}
            >
              На главную
            </FizzyButton>
            <FizzyButton
              onClick={onLogout}
              variant="secondary"
              icon={<Icon name="LogOut" size={18} />}
            >
              Выйти
            </FizzyButton>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ReportsHeader;