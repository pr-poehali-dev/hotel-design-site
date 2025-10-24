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
    <Card className={`relative overflow-hidden border-gray-200 bg-white shadow-sm ${gradient}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16" />
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gray-100`}>
            <Icon name={icon} size={24} className="text-gray-700" />
          </div>
          {trend && (
            <span className="text-sm text-gray-600 font-medium">{trend}</span>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;