import { Card } from '@/components/ui/card';
import OwnerForm from './OwnerForm';
import OwnerList from './OwnerList';

interface Owner {
  apartmentId: string;
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

interface OwnerSectionProps {
  owners: Owner[];
  isAddingNew: boolean;
  editingId: string | null;
  formData: OwnerFormData;
  loading: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: (owner: Owner) => void;
  onDelete: (apartmentId: string) => void;
  onCopyLink: (apartmentId: string) => void;
  onFormChange: (form: OwnerFormData) => void;
}

export default function OwnerSection({
  owners,
  isAddingNew,
  editingId,
  formData,
  loading,
  onSave,
  onCancel,
  onEdit,
  onDelete,
  onCopyLink,
  onFormChange,
}: OwnerSectionProps) {
  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
      <div className="space-y-4">
        {isAddingNew && (
          <OwnerForm
            formData={formData}
            loading={loading}
            isNew={true}
            onSave={onSave}
            onCancel={onCancel}
            onChange={onFormChange}
          />
        )}

        <OwnerList
          owners={owners}
          editingId={editingId}
          formData={formData}
          loading={loading}
          onEdit={onEdit}
          onDelete={onDelete}
          onCopyLink={onCopyLink}
          onSave={onSave}
          onCancel={onCancel}
          onFormChange={onFormChange}
        />
      </div>
    </Card>
  );
}