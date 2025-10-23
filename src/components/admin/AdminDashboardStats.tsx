import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Stats {
  total: number;
  vip: number;
  active: number;
  totalRevenue: string;
}

interface AdminDashboardStatsProps {
  stats: Stats;
}

export default function AdminDashboardStats({ stats }: AdminDashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
            <Icon name="Users" size={24} className="text-white" />
          </div>
          <div>
            <p className="text-white/80 text-xs md:text-sm">Всего гостей</p>
            <p className="text-white text-2xl md:text-3xl font-bold">{stats.total}</p>
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-500 to-amber-600 border-0 p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
            <Icon name="Crown" size={24} className="text-white" />
          </div>
          <div>
            <p className="text-white/80 text-xs md:text-sm">VIP гостей</p>
            <p className="text-white text-2xl md:text-3xl font-bold">{stats.vip}</p>
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-0 p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
            <Icon name="UserCheck" size={24} className="text-white" />
          </div>
          <div>
            <p className="text-white/80 text-xs md:text-sm">Активных</p>
            <p className="text-white text-2xl md:text-3xl font-bold">{stats.active}</p>
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500 to-pink-600 border-0 p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
            <Icon name="DollarSign" size={24} className="text-white" />
          </div>
          <div>
            <p className="text-white/80 text-xs md:text-sm">Доход</p>
            <p className="text-white text-lg md:text-2xl font-bold">${stats.totalRevenue}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
