import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  gradient: string;
  trend?: string;
}

const StatsCard = ({ title, value, icon, gradient, trend }: StatsCardProps) => {
  return (
    <Card className={`relative overflow-hidden backdrop-blur-xl border-white/10 ${gradient}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-white/10 backdrop-blur-sm`}>
            <Icon name={icon} size={24} className="text-white" />
          </div>
          {trend && (
            <span className="text-sm text-white/80 font-medium">{trend}</span>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm text-white/70 font-medium">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
