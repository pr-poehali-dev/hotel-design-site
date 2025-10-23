import Icon from '@/components/ui/icon';

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
}

export default function PullToRefreshIndicator({
  pullDistance,
  isRefreshing
}: PullToRefreshIndicatorProps) {
  if (pullDistance === 0) return null;

  return (
    <div 
      className="flex items-center justify-center transition-all duration-200 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      style={{ 
        height: `${Math.min(pullDistance, 80)}px`,
        opacity: pullDistance / 80
      }}
    >
      <div className="text-white flex items-center gap-2">
        <Icon 
          name="RefreshCw" 
          size={20} 
          className={`${isRefreshing ? 'animate-spin' : ''} ${pullDistance > 80 ? 'rotate-180' : ''} transition-transform`}
        />
        <span className="text-sm">
          {isRefreshing ? 'Обновление...' : pullDistance > 80 ? 'Отпустите для обновления' : 'Потяните для обновления'}
        </span>
      </div>
    </div>
  );
}
