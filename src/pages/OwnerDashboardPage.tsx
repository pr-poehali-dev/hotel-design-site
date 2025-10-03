import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FizzyButton } from '@/components/ui/fizzy-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Apartment {
  apartment_id: string;
  name: string;
}

const OwnerDashboardPage = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [ownerName, setOwnerName] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('ownerToken');
    const ownerId = localStorage.getItem('ownerId');

    if (!token || !ownerId) {
      navigate('/owner-login');
      return;
    }

    loadApartments(ownerId, token);
  }, [navigate]);

  const loadApartments = async (ownerId: string, token: string) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/a953ccdd-84a4-476d-8c34-d7df2687b9ff?ownerId=${ownerId}`, {
        headers: { 'X-Owner-Token': token }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setApartments(data.apartments || []);
        setOwnerName(data.ownerName || '');
      } else {
        toast({ 
          title: 'Ошибка', 
          description: 'Не удалось загрузить квартиры',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({ 
        title: 'Ошибка', 
        description: 'Не удалось подключиться к серверу',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ownerToken');
    localStorage.removeItem('ownerId');
    navigate('/owner-login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Добро пожаловать, {ownerName}!</h1>
            <p className="text-gray-600 mt-1">Выберите квартиру для просмотра отчетов</p>
          </div>
          <FizzyButton
            onClick={handleLogout}
            variant="secondary"
            icon={<Icon name="LogOut" size={18} />}
          >
            Выйти
          </FizzyButton>
        </div>

        {apartments.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Квартиры не найдены</CardTitle>
              <CardDescription>
                К вашему аккаунту пока не привязаны квартиры. Обратитесь к администратору.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {apartments.map((apartment) => (
              <Card 
                key={apartment.apartment_id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/owner/${apartment.apartment_id}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Home" size={20} />
                    {apartment.name}
                  </CardTitle>
                  <CardDescription>Нажмите, чтобы посмотреть отчеты</CardDescription>
                </CardHeader>
                <CardContent>
                  <FizzyButton
                    className="w-full"
                    icon={<Icon name="FileText" size={18} />}
                  >
                    Открыть отчеты
                  </FizzyButton>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboardPage;