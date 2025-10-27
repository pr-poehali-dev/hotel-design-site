import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import OwnerForm from './OwnerForm';

interface Owner {
  apartmentId: string;
  apartmentNumber?: string;
  apartmentName?: string;
  ownerEmail: string;
  ownerName: string;
  commissionRate: number;
}

interface OwnerFormData {
  apartmentId: string;
  ownerEmail: string;
  ownerName: string;
  commissionRate: number;
}

interface OwnerListProps {
  owners: Owner[];
  editingId: string | null;
  formData: OwnerFormData;
  loading: boolean;
  onEdit: (owner: Owner) => void;
  onDelete: (apartmentId: string) => void;
  onCopyLink: (apartmentId: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onFormChange: (form: OwnerFormData) => void;
}

export default function OwnerList({
  owners,
  editingId,
  formData,
  loading,
  onEdit,
  onDelete,
  onCopyLink,
  onSave,
  onCancel,
  onFormChange,
}: OwnerListProps) {
  return (
    <>
      {owners.map((owner) => {
        const isEditing = editingId === owner.apartmentId;

        return (
          <div
            key={owner.apartmentId}
            className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3 hover:bg-white/10 hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">
                {owner.apartmentNumber ? `Апартамент ${owner.apartmentNumber}` : `Апартамент ${owner.apartmentId}`}
              </h3>
              <div className="flex gap-2">
                <Button
                  onClick={() => onCopyLink(owner.apartmentId)}
                  variant="outline"
                  size="sm"
                  className="hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <Icon name="Link" size={16} />
                  Скопировать ссылку
                </Button>
                <Button
                  onClick={() => onDelete(owner.apartmentId)}
                  variant="outline"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>

            {isEditing ? (
              <OwnerForm
                formData={formData}
                loading={loading}
                isNew={false}
                onSave={onSave}
                onCancel={onCancel}
                onChange={onFormChange}
              />
            ) : (
              <div className="space-y-2">
                <div className="text-slate-300">
                  <span className="text-slate-400">Имя:</span> {owner.ownerName}
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-400">Email:</span> {owner.ownerEmail}
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-400">Комиссия:</span> {owner.commissionRate}%
                </div>
                <Button onClick={() => onEdit(owner)} variant="outline" size="sm" className="hover:scale-105 active:scale-95 transition-all duration-200">
                  <Icon name="Edit" size={16} />
                  Изменить
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}