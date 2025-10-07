import { Card } from '@/components/ui/card';
import { FizzyButton } from '@/components/ui/fizzy-button';
import Icon from '@/components/ui/icon';

const ProfileSection = () => {
  const handleLoginRedirect = () => {
    window.location.href = '/guest-login';
  };

  const handleRegisterRedirect = () => {
    window.location.href = '/guest-register';
  };

  return (
    <section className="py-20 min-h-screen bg-gradient-to-br from-charcoal-900 to-charcoal-800 flex items-center justify-center">
      <div className="container mx-auto px-6">
        <Card className="max-w-md mx-auto p-10 bg-white shadow-2xl border-0 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="Lock" size={40} className="text-white" />
          </div>
          
          <h2 className="text-3xl font-playfair font-bold text-charcoal-900 mb-4">
            Личный кабинет гостя
          </h2>
          
          <p className="text-charcoal-600 font-inter mb-8">
            Войдите с помощью email и пароля для доступа к вашим бронированиям
          </p>
          
          <FizzyButton 
            onClick={handleLoginRedirect}
            className="w-full bg-gold-500 hover:bg-gold-600 mb-4"
            icon={<Icon name="LogIn" size={20} />}
          >
            Войти в кабинет
          </FizzyButton>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-charcoal-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-charcoal-500">или</span>
            </div>
          </div>
          
          <FizzyButton 
            onClick={handleRegisterRedirect}
            className="w-full bg-charcoal-700 hover:bg-charcoal-800 text-white"
            icon={<Icon name="UserPlus" size={20} />}
          >
            Зарегистрироваться
          </FizzyButton>
          
          <p className="text-sm text-charcoal-500 font-inter mt-6">
            После регистрации вы сможете отслеживать бронирования и получать инструкции по заселению
          </p>
        </Card>
      </div>
    </section>
  );
};

export default ProfileSection;