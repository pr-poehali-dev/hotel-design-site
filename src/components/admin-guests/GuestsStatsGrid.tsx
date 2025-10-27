import StatsCard from '@/components/admin-guests/StatsCard';
import { GuestStats } from '@/types/guest';

interface GuestsStatsGridProps {
  stats: GuestStats;
}

const GuestsStatsGrid = ({ stats }: GuestsStatsGridProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatsCard
        title="Всего гостей"
        value={stats.total_guests}
        icon="Users"
        gradient="bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
      />
      <StatsCard
        title="VIP гостей"
        value={stats.vip_guests}
        icon="Crown"
        gradient="bg-gradient-to-br from-yellow-500/20 to-orange-500/20"
      />
      <StatsCard
        title="Активных"
        value={stats.active_guests}
        icon="TrendingUp"
        gradient="bg-gradient-to-br from-green-500/20 to-emerald-500/20"
      />
      <StatsCard
        title="Общий доход"
        value={`${(stats.total_revenue / 1000).toFixed(0)}k ₽`}
        icon="DollarSign"
        gradient="bg-gradient-to-br from-purple-500/20 to-pink-500/20"
      />
    </div>
  );
};

export default GuestsStatsGrid;
