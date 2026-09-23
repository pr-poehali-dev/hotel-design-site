import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

interface Leaf {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
  swayAmount: number;
  opacity: number;
  color: string;
}

const LEAF_COLORS = ['#d97706', '#ea580c', '#b45309', '#ca8a04', '#9a3412', '#eab308'];

const FallingLeaves = () => {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const newLeaves: Leaf[] = [];
    for (let i = 0; i < 28; i++) {
      newLeaves.push({
        id: i,
        left: Math.random() * 100,
        animationDuration: 9 + Math.random() * 12,
        animationDelay: Math.random() * 10,
        size: 14 + Math.random() * 16,
        swayAmount: 20 + Math.random() * 40,
        opacity: 0.5 + Math.random() * 0.5,
        color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
      });
    }
    setLeaves(newLeaves);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute animate-leaf-fall"
          style={{
            left: `${leaf.left}%`,
            top: '-10%',
            animationDuration: `${leaf.animationDuration}s`,
            animationDelay: `${leaf.animationDelay}s`,
            '--sway-amount': `${leaf.swayAmount}px`,
          } as React.CSSProperties}
        >
          <div
            className="animate-leaf-sway"
            style={{
              animationDuration: `${leaf.animationDuration / 3}s`,
              animationDelay: `${leaf.animationDelay}s`,
            }}
          >
            <Icon
              name="Leaf"
              size={leaf.size}
              style={{
                color: leaf.color,
                opacity: leaf.opacity,
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.35))',
              }}
            />
          </div>
        </div>
      ))}
      <style>{`
        @keyframes leaf-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 0.9;
          }
          100% {
            transform: translateY(110vh) rotate(540deg);
            opacity: 0;
          }
        }

        @keyframes leaf-sway {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(var(--sway-amount, 30px));
          }
          75% {
            transform: translateX(calc(var(--sway-amount, 30px) * -1));
          }
        }

        .animate-leaf-fall {
          animation: leaf-fall linear infinite;
        }

        .animate-leaf-sway {
          animation: leaf-sway ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default FallingLeaves;
