import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Owner {
  apartment_id: string;
  apartment_number?: string;
  apartment_name?: string;
  owner_name: string;
  owner_email: string;
  commission_rate: number;
}

const OwnerCommissionManager = () => {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editingRates, setEditingRates] = useState<Record<string, number>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadOwners();
  }, []);

  const loadOwners = async () => {
    setLoading(true);
    try {
      console.log('Loading owners from API...');
      const response = await fetch('https://functions.poehali.dev/d54660a1-bb13-44aa-a3f9-09772059a519');
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Received data:', data);
      setOwners(data.owners || []);
      
      const initialRates: Record<string, number> = {};
      data.owners.forEach((owner: Owner) => {
        initialRates[owner.apartment_id] = owner.commission_rate;
      });
      setEditingRates(initialRates);
      console.log('Loaded owners:', data.owners?.length || 0);
    } catch (error) {
      console.error('Error loading owners:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить список владельцев',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRateChange = (apartmentId: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      setEditingRates(prev => ({
        ...prev,
        [apartmentId]: numValue
      }));
    }
  };

  const handleSave = async (apartmentId: string) => {
    setSaving(apartmentId);
    try {
      const response = await fetch('https://functions.poehali.dev/d54660a1-bb13-44aa-a3f9-09772059a519', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apartment_id: apartmentId,
          commission_rate: editingRates[apartmentId]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update commission rate');
      }

      setOwners(prev => prev.map(owner => 
        owner.apartment_id === apartmentId 
          ? { ...owner, commission_rate: editingRates[apartmentId] }
          : owner
      ));

      toast({
        title: 'Сохранено',
        description: 'Комиссия успешно обновлена'
      });
    } catch (error) {
      console.error('Error saving commission:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить комиссию',
        variant: 'destructive'
      });
    } finally {
      setSaving(null);
    }
  };

  const hasChanges = (apartmentId: string) => {
    const owner = owners.find(o => o.apartment_id === apartmentId);
    return owner && editingRates[apartmentId] !== owner.commission_rate;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Icon name="Loader2" size={24} className="animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Загрузка...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Percent" size={24} className="text-gold-500" />
          Управление комиссией
        </CardTitle>
        <CardDescription>
          Установите индивидуальный процент комиссии для каждого апартамента
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {owners.map(owner => (
            <div 
              key={owner.apartment_id}
              className="p-4 border border-gray-200 rounded-lg hover:border-gold-300 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {owner.apartment_number 
                      ? `Апартамент ${owner.apartment_number}`
                      : `Апартамент ${owner.apartment_id}`
                    }
                  </h3>
                  {owner.apartment_name && (
                    <p className="text-sm text-gray-600">{owner.apartment_name}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <Icon name="User" size={14} />
                    <span>{owner.owner_name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`rate-${owner.apartment_id}`} className="text-sm whitespace-nowrap">
                      Комиссия:
                    </Label>
                    <div className="relative">
                      <Input
                        id={`rate-${owner.apartment_id}`}
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={editingRates[owner.apartment_id] || 0}
                        onChange={(e) => handleRateChange(owner.apartment_id, e.target.value)}
                        className="w-24 pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        %
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSave(owner.apartment_id)}
                    disabled={!hasChanges(owner.apartment_id) || saving === owner.apartment_id}
                    className="bg-gold-500 hover:bg-gold-600 text-white"
                    size="sm"
                  >
                    {saving === owner.apartment_id ? (
                      <>
                        <Icon name="Loader2" size={16} className="animate-spin" />
                      </>
                    ) : (
                      <>
                        <Icon name="Save" size={16} />
                        <span className="ml-1 hidden md:inline">Сохранить</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {owners.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Icon name="Building" size={48} className="mx-auto mb-2 opacity-20" />
              <p>Нет данных о владельцах апартаментов</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OwnerCommissionManager;