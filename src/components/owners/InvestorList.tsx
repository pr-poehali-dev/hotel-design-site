import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface OwnerUser {
  id: number;
  username: string;
  apartment_number: string;
  full_name: string;
  email: string;
  phone: string;
  is_active: boolean;
}

interface InvestorListProps {
  users: OwnerUser[];
  onToggleStatus: (id: number, currentStatus: boolean) => void;
  onDelete: (id: number) => void;
}

export default function InvestorList({
  users,
  onToggleStatus,
  onDelete,
}: InvestorListProps) {
  return (
    <div className="space-y-3">
      {users.map((user) => (
        <div key={user.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-white">{user.full_name}</h3>
                <span className={`px-2 py-1 rounded text-xs ${
                  user.is_active 
                    ? 'bg-green-500/20 text-green-300' 
                    : 'bg-red-500/20 text-red-300'
                }`}>
                  {user.is_active ? 'Активен' : 'Отключён'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                <div><span className="text-slate-400">Логин:</span> {user.username}</div>
                <div><span className="text-slate-400">Апартамент:</span> {user.apartment_number || '—'}</div>
                <div><span className="text-slate-400">Email:</span> {user.email || '—'}</div>
                <div><span className="text-slate-400">Телефон:</span> {user.phone || '—'}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => onToggleStatus(user.id, user.is_active)}
                variant="outline"
                size="sm"
              >
                <Icon name={user.is_active ? "UserX" : "UserCheck"} size={16} />
              </Button>
              <Button
                onClick={() => onDelete(user.id)}
                variant="outline"
                size="sm"
                className="text-red-400 hover:text-red-300"
              >
                <Icon name="Trash2" size={16} />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
