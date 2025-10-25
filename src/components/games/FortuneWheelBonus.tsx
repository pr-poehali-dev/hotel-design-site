import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import { playWinSound, playSpinSound } from '@/utils/soundEffects';

interface FortuneWheelBonusProps {
  guestId: string;
  onPointsUpdate: (newPoints: number) => void;
}

const FortuneWheelBonus = ({ guestId, onPointsUpdate }: FortuneWheelBonusProps) => {
  const { toast } = useToast();
  const [canSpin, setCanSpin] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [nextSpinDate, setNextSpinDate] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [lastBonus, setLastBonus] = useState<number | null>(null);

  const segments = [
    { points: 500, color: 'from-blue-400 to-blue-600' },
    { points: 1000, color: 'from-purple-400 to-purple-600' },
    { points: 500, color: 'from-blue-400 to-blue-600' },
    { points: 1000, color: 'from-purple-400 to-purple-600' },
    { points: 500, color: 'from-blue-400 to-blue-600' },
    { points: 1000, color: 'from-purple-400 to-purple-600' },
    { points: 1000, color: 'from-purple-400 to-purple-600' },
    { points: 1000, color: 'from-purple-400 to-purple-600' },
    { points: 1000, color: 'from-purple-400 to-purple-600' },
    { points: 5000, color: 'from-orange-400 to-orange-600' },
    { points: 10000, color: 'from-gold-400 to-gold-600' },
    { points: 500, color: 'from-blue-400 to-blue-600' },
  ];

  useEffect(() => {
    checkSpinAvailability();
  }, [guestId]);

  useEffect(() => {
    if (!nextSpinDate) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(nextSpinDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft('');
        setCanSpin(true);
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${days}д ${hours}ч ${minutes}м ${seconds}с`);
    }, 1000);

    return () => clearInterval(interval);
  }, [nextSpinDate]);

  const checkSpinAvailability = async () => {
    try {
      const response = await fetch(`https://functions.poehali.dev/76a63047-54d9-43c8-ab3d-9b36904f1fb3?guest_id=${guestId}`);
      const data = await response.json();

      setCanSpin(data.can_spin);
      setNextSpinDate(data.next_spin_available);
      setLastBonus(data.last_bonus);
    } catch (error) {
      console.error('Error checking spin availability:', error);
    }
  };

  const spinWheel = async () => {
    if (!canSpin || isSpinning) return;

    setIsSpinning(true);
    playSpinSound();

    try {
      const response = await fetch('https://functions.poehali.dev/76a63047-54d9-43c8-ab3d-9b36904f1fb3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guest_id: guestId })
      });

      const data = await response.json();

      if (data.success) {
        const targetIndex = segments.findIndex(s => s.points === data.bonus_points);
        const targetRotation = 360 * 5 + (360 / segments.length) * targetIndex;

        setRotation(targetRotation);

        setTimeout(() => {
          if (data.bonus_points >= 5000) {
            playWinSound('big');
            confetti({
              particleCount: 200,
              spread: 100,
              origin: { y: 0.6 },
              colors: ['#FFD700', '#FFA500', '#FF6347', '#9333ea', '#3b82f6']
            });
            setTimeout(() => {
              confetti({
                particleCount: 100,
                angle: 60,
                spread: 55,
                origin: { x: 0 }
              });
              confetti({
                particleCount: 100,
                angle: 120,
                spread: 55,
                origin: { x: 1 }
              });
            }, 250);
          } else if (data.bonus_points >= 1000) {
            playWinSound('medium');
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          } else {
            playWinSound('small');
          }

          toast({
            title: '🎉 Поздравляем!',
            description: `Вы выиграли ${data.bonus_points.toLocaleString('ru-RU')} баллов!`,
          });

          onPointsUpdate(data.total_bonus_points);
          setCanSpin(false);
          setNextSpinDate(data.next_spin_available);
          setLastBonus(data.bonus_points);
          setIsSpinning(false);
        }, 4000);
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось прокрутить колесо',
          variant: 'destructive'
        });
        setIsSpinning(false);
      }
    } catch (error) {
      console.error('Error spinning wheel:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось прокрутить колесо',
        variant: 'destructive'
      });
      setIsSpinning(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-gold-900/30 to-gold-700/20 backdrop-blur-xl border-gold-500/30 p-4 md:p-6 shadow-2xl">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse">
          <Icon name="Sparkles" size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-playfair font-bold text-white mb-1">Колесо Фортуны</h3>
          <p className="text-gold-200 text-xs">Крутите раз в неделю и выигрывайте!</p>
        </div>
      </div>

      <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto mb-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-full h-full bg-gradient-to-br from-gold-300/20 to-gold-600/20 rounded-full blur-xl"></div>
          
          <div 
            className="relative w-44 h-44 md:w-52 md:h-52 rounded-full shadow-2xl ring-2 ring-gold-400/50"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none'
            }}
          >
            {segments.map((segment, index) => (
              <div
                key={index}
                className={`absolute w-full h-full bg-gradient-to-br ${segment.color} shadow-inner`}
                style={{
                  clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((index * 30 - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((index * 30 - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos(((index + 1) * 30 - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin(((index + 1) * 30 - 90) * Math.PI / 180)}%)`,
                  borderRadius: '50%'
                }}
              >
                <div
                  className="absolute text-white font-bold text-xs md:text-sm drop-shadow-lg"
                  style={{
                    top: '25%',
                    left: '50%',
                    transform: `rotate(${index * 30 + 15}deg) translateY(-55px)`,
                    transformOrigin: 'center'
                  }}
                >
                  {segment.points}
                </div>
              </div>
            ))}
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-gold-300 to-gold-500 rounded-full shadow-2xl flex items-center justify-center border-2 border-white">
                <Icon name="Star" size={20} className="text-white drop-shadow-lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
          <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[16px] border-l-transparent border-r-transparent border-t-red-600 drop-shadow-xl"></div>
        </div>
      </div>

      {canSpin ? (
        <Button
          onClick={spinWheel}
          disabled={isSpinning}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 md:py-4 text-sm md:text-base"
        >
          {isSpinning ? (
            <>
              <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
              <span className="hidden sm:inline">Крутим...</span>
              <span className="sm:hidden">...</span>
            </>
          ) : (
            <>
              <Icon name="Play" size={18} className="mr-2" />
              <span className="hidden sm:inline">Крутить колесо</span>
              <span className="sm:hidden">Крутить</span>
            </>
          )}
        </Button>
      ) : (
        <div className="text-center">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 md:p-4">
            <Icon name="Clock" size={32} className="mx-auto mb-2 text-white/40" />
            <p className="text-white/60 text-xs mb-1">Следующая прокрутка через:</p>
            <p className="text-base md:text-lg font-bold text-white mb-2">{timeLeft}</p>
            {lastBonus && (
              <p className="text-white/40 text-xs">
                Последний выигрыш: {lastBonus.toLocaleString('ru-RU')} баллов
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default FortuneWheelBonus;