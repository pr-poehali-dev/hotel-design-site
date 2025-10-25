import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

interface ScratchCardsProps {
  guestId: string;
  bookingId: string;
  onPointsUpdate: (newPoints: number) => void;
}

const ScratchCards = ({ guestId, bookingId, onPointsUpdate }: ScratchCardsProps) => {
  const { toast } = useToast();
  const [hasCard, setHasCard] = useState(false);
  const [isScratched, setIsScratched] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [wonPoints, setWonPoints] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkCardStatus();
  }, [guestId, bookingId]);

  const checkCardStatus = async () => {
    try {
      const response = await fetch(
        `https://functions.poehali.dev/89112d1f-1a35-49dd-98b0-9579b4ac652d?guest_id=${guestId}&booking_id=${bookingId}`
      );
      const data = await response.json();

      setHasCard(data.has_card);
      if (data.has_card) {
        setIsScratched(data.is_scratched);
        if (data.is_scratched) {
          setWonPoints(data.bonus_points);
        }
      } else {
        await createCard();
      }
    } catch (error) {
      console.error('Error checking card status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createCard = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/89112d1f-1a35-49dd-98b0-9579b4ac652d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          guest_id: guestId,
          booking_id: bookingId
        })
      });

      const data = await response.json();
      if (data.success) {
        setHasCard(true);
      }
    } catch (error) {
      console.error('Error creating card:', error);
    }
  };

  const selectCard = (index: number) => {
    if (isScratched || selectedCard !== null) return;
    setSelectedCard(index);
  };

  const scratchCard = async () => {
    if (selectedCard === null || isScratching) return;

    setIsScratching(true);

    try {
      const response = await fetch('https://functions.poehali.dev/89112d1f-1a35-49dd-98b0-9579b4ac652d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'scratch',
          guest_id: guestId,
          booking_id: bookingId
        })
      });

      const data = await response.json();

      if (data.success) {
        setTimeout(() => {
          setWonPoints(data.bonus_points);
          setIsScratched(true);
          setIsScratching(false);

          if (data.bonus_points >= 3000) {
            confetti({
              particleCount: 150,
              spread: 100,
              origin: { y: 0.6 },
              colors: ['#FFD700', '#FFA500', '#FF6347']
            });
            setTimeout(() => {
              confetti({
                particleCount: 80,
                angle: 60,
                spread: 55,
                origin: { x: 0 }
              });
              confetti({
                particleCount: 80,
                angle: 120,
                spread: 55,
                origin: { x: 1 }
              });
            }, 250);
          } else if (data.bonus_points > 0) {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.6 }
            });
          }

          toast({
            title: data.bonus_points > 0 ? '🎉 Поздравляем!' : '😔 Не повезло',
            description: data.message,
          });

          if (data.bonus_points > 0) {
            onPointsUpdate(data.total_bonus_points);
          }
        }, 1500);
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось стереть карту',
          variant: 'destructive'
        });
        setIsScratching(false);
      }
    } catch (error) {
      console.error('Error scratching card:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось стереть карту',
        variant: 'destructive'
      });
      setIsScratching(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 backdrop-blur-xl border-white/10 p-6">
        <div className="flex items-center justify-center py-12">
          <Icon name="Loader2" size={48} className="animate-spin text-orange-500" />
        </div>
      </Card>
    );
  }

  if (!hasCard) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 backdrop-blur-xl border-white/10 p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <Icon name="Gift" size={28} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-1">Scratch-карты</h3>
          <p className="text-white/60 text-sm">
            {isScratched
              ? 'Вы уже использовали свою карту'
              : 'Выберите одну карту из 30 и сотрите её!'}
          </p>
        </div>
      </div>

      {isScratched ? (
        <div className="text-center py-8">
          <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl">
            {wonPoints && wonPoints > 0 ? (
              <div className="text-center">
                <Icon name="Trophy" size={48} className="text-white mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{wonPoints}</p>
              </div>
            ) : (
              <Icon name="X" size={64} className="text-white" />
            )}
          </div>
          <p className="text-xl font-bold text-white mb-2">
            {wonPoints && wonPoints > 0
              ? `Вы выиграли ${wonPoints.toLocaleString('ru-RU')} баллов!`
              : 'К сожалению, эта карта без выигрыша'}
          </p>
          <p className="text-white/60 text-sm">
            Получите новую карту после следующего выезда
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-6 gap-3 mb-6">
            {Array.from({ length: 30 }, (_, i) => (
              <button
                key={i}
                onClick={() => selectCard(i)}
                disabled={selectedCard !== null && selectedCard !== i}
                className={`
                  aspect-square rounded-xl transition-all duration-300 transform
                  ${selectedCard === i
                    ? 'bg-gradient-to-br from-gold-400 to-gold-600 scale-110 shadow-2xl ring-4 ring-gold-300'
                    : selectedCard === null
                    ? 'bg-gradient-to-br from-orange-400 to-red-500 hover:scale-105 hover:shadow-xl'
                    : 'bg-gradient-to-br from-gray-600 to-gray-700 opacity-30 scale-95'
                  }
                  flex items-center justify-center
                `}
              >
                <Icon
                  name="Gift"
                  size={20}
                  className={selectedCard === i ? 'text-white' : 'text-white/80'}
                />
              </button>
            ))}
          </div>

          <Button
            onClick={scratchCard}
            disabled={selectedCard === null || isScratching}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-6 text-lg disabled:opacity-50"
            size="lg"
          >
            {isScratching ? (
              <>
                <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                Стираем...
              </>
            ) : selectedCard === null ? (
              <>
                <Icon name="Hand" size={20} className="mr-2" />
                Выберите карту
              </>
            ) : (
              <>
                <Icon name="Sparkles" size={20} className="mr-2" />
                Стереть карту #{selectedCard + 1}
              </>
            )}
          </Button>

          <div className="mt-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
            <p className="text-white/60 text-xs text-center">
              💡 Шансы: 10 пустых • 10 по 1000₽ • 5 по 2000₽ • 4 по 3000₽ • 1 по 5000₽
            </p>
          </div>
        </>
      )}
    </Card>
  );
};

export default ScratchCards;