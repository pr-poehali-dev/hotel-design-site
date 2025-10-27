import Icon from '@/components/ui/icon';

interface StatusCardProps {
  isVip: boolean;
  bonusPoints: number;
}

const StatusCard = ({ isVip, bonusPoints }: StatusCardProps) => {
  return (
    <>
      <div className="hidden sm:block fixed top-20 right-4 z-40 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl animate-slide-in-right">
        <div className="space-y-3">
          <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Icon name={isVip ? "Crown" : "User"} className={`${isVip ? 'text-yellow-400' : 'text-white/60'} w-5 h-5`} />
            <div>
              <p className="text-white/60 text-xs">Статус</p>
              <p className={`text-sm font-bold ${isVip ? 'text-yellow-400' : 'text-white'}`}>
                {isVip ? 'VIP' : 'Обычный'}
              </p>
            </div>
          </div>
          
          {!isVip && (
            <div className="flex items-center gap-2 opacity-40 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Icon name="Crown" className="text-white/40 w-5 h-5" />
              <div>
                <p className="text-white/40 text-xs">VIP</p>
                <p className="text-white/40 text-sm font-bold">Не активирован</p>
              </div>
            </div>
          )}
          
          <div className="pt-3 border-t border-white/20 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2">
              <Icon name="Star" className="text-yellow-400 w-5 h-5" />
              <div>
                <p className="text-white/60 text-xs">Баллы</p>
                <p className="text-white text-sm font-bold">{(bonusPoints || 0).toLocaleString('ru-RU')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 mb-4 mx-3 animate-fade-in">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Icon name={isVip ? "Crown" : "User"} className={`${isVip ? 'text-yellow-400' : 'text-white/60'} w-5 h-5`} />
            <div>
              <p className="text-white/60 text-xs">Статус</p>
              <p className={`text-xs font-bold ${isVip ? 'text-yellow-400' : 'text-white'}`}>
                {isVip ? 'VIP' : 'Обычный'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Icon name="Star" className="text-yellow-400 w-5 h-5" />
            <div>
              <p className="text-white/60 text-xs">Баллы</p>
              <p className="text-white text-xs font-bold">{(bonusPoints || 0).toLocaleString('ru-RU')}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatusCard;
