import { useEffect, useState } from 'react';

interface Leaf {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
  rotation: number;
  swayAmount: number;
}

const FallingLeaves = () => {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const generateLeaves = () => {
      const newLeaves: Leaf[] = [];
      for (let i = 0; i < 8; i++) {
        newLeaves.push({
          id: i,
          left: Math.random() * 100,
          animationDuration: 15 + Math.random() * 10,
          animationDelay: Math.random() * 5,
          size: 20 + Math.random() * 15,
          rotation: Math.random() * 360,
          swayAmount: 30 + Math.random() * 40,
        });
      }
      setLeaves(newLeaves);
    };

    generateLeaves();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute animate-fall"
          style={{
            left: `${leaf.left}%`,
            top: '-10%',
            animationDuration: `${leaf.animationDuration}s`,
            animationDelay: `${leaf.animationDelay}s`,
            '--sway-amount': `${leaf.swayAmount}px`,
          } as React.CSSProperties}
        >
          <div
            className="animate-sway-leaf"
            style={{
              animationDuration: `${leaf.animationDuration / 3}s`,
              animationDelay: `${leaf.animationDelay}s`,
            }}
          >
            <svg
              width={leaf.size}
              height={leaf.size}
              viewBox="0 0 24 24"
              fill="none"
              style={{
                transform: `rotate(${leaf.rotation}deg)`,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              }}
            >
              <path
                d="M12 2C12 2 7 6 7 12C7 15.866 9.134 19 12 19C14.866 19 17 15.866 17 12C17 6 12 2 12 2Z"
                fill="#D97706"
                opacity="0.9"
              />
              <path
                d="M12 2C12 2 8.5 5 8.5 10C8.5 13 10 16 12 16"
                stroke="#92400E"
                strokeWidth="0.5"
                opacity="0.6"
              />
              <path
                d="M12 5L14 8"
                stroke="#92400E"
                strokeWidth="0.5"
                opacity="0.4"
              />
              <path
                d="M12 9L10 12"
                stroke="#92400E"
                strokeWidth="0.5"
                opacity="0.4"
              />
            </svg>
          </div>
        </div>
      ))}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(110vh);
            opacity: 0;
          }
        }
        
        @keyframes sway-leaf {
          0%, 100% {
            transform: translateX(0) rotate(0deg);
          }
          25% {
            transform: translateX(var(--sway-amount, 40px)) rotate(5deg);
          }
          75% {
            transform: translateX(calc(var(--sway-amount, 40px) * -1)) rotate(-5deg);
          }
        }
        
        .animate-fall {
          animation: fall linear infinite;
        }
        
        .animate-sway-leaf {
          animation: sway-leaf ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default FallingLeaves;
