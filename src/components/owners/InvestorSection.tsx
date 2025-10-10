import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import InvestorForm from './InvestorForm';
import InvestorList from './InvestorList';

interface OwnerUser {
  id: number;
  username: string;
  apartment_number: string;
  full_name: string;
  email: string;
  phone: string;
  is_active: boolean;
}

interface InvestorFormData {
  username: string;
  password: string;
  apartment_number: string;
  full_name: string;
  email: string;
  phone: string;
}

interface InvestorSectionProps {
  ownerUsers: OwnerUser[];
  isAddingInvestor: boolean;
  investorForm: InvestorFormData;
  loading: boolean;
  onAddInvestor: () => void;
  onSaveInvestor: () => void;
  onCancelInvestor: () => void;
  onDeleteInvestor: (id: number) => void;
  onToggleStatus: (id: number, currentStatus: boolean) => void;
  onFormChange: (form: InvestorFormData) => void;
}

export default function InvestorSection({
  ownerUsers,
  isAddingInvestor,
  investorForm,
  loading,
  onAddInvestor,
  onSaveInvestor,
  onCancelInvestor,
  onDeleteInvestor,
  onToggleStatus,
  onFormChange,
}: InvestorSectionProps) {
  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Доступы инвесторов</h2>
        <Button onClick={onAddInvestor} disabled={isAddingInvestor}>
          <Icon name="UserPlus" size={20} />
          Создать доступ
        </Button>
      </div>

      {isAddingInvestor && (
        <InvestorForm
          formData={investorForm}
          loading={loading}
          onSave={onSaveInvestor}
          onCancel={onCancelInvestor}
          onChange={onFormChange}
        />
      )}

      <InvestorList
        users={ownerUsers}
        onToggleStatus={onToggleStatus}
        onDelete={onDeleteInvestor}
      />
    </Card>
  );
}
