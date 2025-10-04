import { RoomStats } from './types';

interface StatsCardsProps {
  stats: RoomStats;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      <div className="bg-charcoal-800 rounded-xl p-4 border border-gray-700">
        <p className="text-gray-400 text-sm mb-1">Всего номеров</p>
        <p className="text-3xl font-bold text-white">{stats.total}</p>
      </div>
      <div className="bg-charcoal-800 rounded-xl p-4 border border-green-500/30">
        <p className="text-gray-400 text-sm mb-1">Чисто</p>
        <p className="text-3xl font-bold text-green-500">{stats.clean}</p>
      </div>
      <div className="bg-charcoal-800 rounded-xl p-4 border border-red-500/30">
        <p className="text-gray-400 text-sm mb-1">Грязно</p>
        <p className="text-3xl font-bold text-red-500">{stats.dirty}</p>
      </div>
      <div className="bg-charcoal-800 rounded-xl p-4 border border-yellow-500/30">
        <p className="text-gray-400 text-sm mb-1">В процессе</p>
        <p className="text-3xl font-bold text-yellow-500">{stats.inProgress}</p>
      </div>
      <div className="bg-charcoal-800 rounded-xl p-4 border border-blue-500/30">
        <p className="text-gray-400 text-sm mb-1">Проверка</p>
        <p className="text-3xl font-bold text-blue-500">{stats.inspection}</p>
      </div>
    </div>
  );
};

export default StatsCards;
