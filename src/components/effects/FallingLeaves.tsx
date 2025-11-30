import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
  swayAmount: number;
  opacity: number;
}

const FallingLeaves = () => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const generateSnowflakes = () => {
      const newSnowflakes: Snowflake[] = [];
      for (let i = 0; i < 50; i++) {
        newSnowflakes.push({
          id: i,
          left: Math.random() * 100,
          animationDuration: 10 + Math.random() * 20,
          animationDelay: Math.random() * 10,
          size: 10 + Math.random() * 20,
          swayAmount: 20 + Math.random() * 30,
          opacity: 0.3 + Math.random() * 0.7,
        });
      }
      setSnowflakes(newSnowflakes);
    };

    generateSnowflakes();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {snowflakes.map((snowflake) => (
        <div
          key={snowflake.id}
          className="absolute animate-fall"
          style={{
            left: `${snowflake.left}%`,
            top: '-10%',
            animationDuration: `${snowflake.animationDuration}s`,
            animationDelay: `${snowflake.animationDelay}s`,
            '--sway-amount': `${snowflake.swayAmount}px`,
          } as React.CSSProperties}
        >
          <div
            className="animate-sway-leaf"
            style={{
              animationDuration: `${snowflake.animationDuration / 3}s`,
              animationDelay: `${snowflake.animationDelay}s`,
            }}
          >
            <svg
              width={snowflake.size}
              height={snowflake.size}
              viewBox="0 0 24 24"
              fill="none"
              style={{
                filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.8))',
              }}
            >
              <path
                d="M12 2L12 22M12 2L9 5M12 2L15 5M12 22L9 19M12 22L15 19"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity={snowflake.opacity}
              />
              <path
                d="M4.93 7L19.07 17M4.93 7L7.5 5.5M4.93 7L6 10M19.07 17L16.5 18.5M19.07 17L18 14"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity={snowflake.opacity}
              />
              <path
                d="M4.93 17L19.07 7M4.93 17L7.5 18.5M4.93 17L6 14M19.07 7L16.5 5.5M19.07 7L18 10"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity={snowflake.opacity}
              />
            </svg>
          </div>
        </div>
      ))}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes sway-leaf {
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
