import * as React from "react";
import { cn } from "@/lib/utils";
import "./fizzy-button.css";

export interface FizzyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

const FizzyButton = React.forwardRef<HTMLButtonElement, FizzyButtonProps>(
  ({ className, children, icon, variant = "primary", size = "md", ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(false);
    const [trails, setTrails] = React.useState<Array<{ id: number; x: number; y: number }>>([]);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);
    const buttonRef = React.useRef<HTMLDivElement>(null);
    const trailIdRef = React.useRef(0);

    React.useEffect(() => {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZVRE5WK7q7aZWFApAmuPxxXMpBzGDzPPagDoFJHfH8N+QPgkVXrTp66hVFApGn+DyQGwhBTOGzvLVhzkGHm+/7+OZURE5WK7q7aZWFApAmOPyx3MoBzOEzPPagDoFJHfH8N+QPgkVXrTp66hVFApFnuDyQGwhBTKHzvPVhzkGHm+/7+OZURE5Wa7q7aZWFApAl+Pyx3MoBzOEzPPagDoFJHfH8N+QPgkVXrTp66hVFApFnuDyv2wiBDKHzvLVhzoGHm+/7+OZVRE5Wa7q7aZWFApAl+Pyx3MoBzKEzPPagDoFJHfH8N+QPggVXrTp66hVFApFnuDyv2wiBDKHzvLVhzoGHm+/7+OZVRE5Wa7q7aZWFApAl+Pyx3MoBzKEzPPagDoFJHfH8N+QPggVXrTp66hVFApFnuDyv2wiBDKHzvLVhzoGHm+/7+OZVRE5Wa7q7aZWFApAl+Pyx3MoBzKEzPPagDoFJHfH8N+QPggVXrTp66hVFApFnuDyv2wiBDKHzvLVhzoGHm+/7+OZVRE5Wa7q7aZWFApAl+Pyx3MoBzKEzPPagDoFJHfH8N+QPggVXrTp66hVFApFnuDyv2wiBDKHzvLVhzoGHm+/7+OZVRE5Wa7q7aZWFApAl+Pyx3MoBzKEzPPagDoFJHfH8N+QPggVXrTp66hVFA==');
      audioRef.current.volume = 0.3;
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!buttonRef.current) return;
      
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newTrail = { id: trailIdRef.current++, x, y };
      setTrails(prev => [...prev, newTrail]);
      
      setTimeout(() => {
        setTrails(prev => prev.filter(t => t.id !== newTrail.id));
      }, 600);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsChecked(true);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      setTimeout(() => setIsChecked(false), 2000);
      props.onClick?.(e);
    };

    return (
      <div 
        ref={buttonRef}
        className={cn("fizzy-button-wrapper", className)}
        onMouseMove={handleMouseMove}
      >
        <input
          id={`fizzy-${Math.random()}`}
          type="checkbox"
          className="fizzy-checkbox"
          checked={isChecked}
          readOnly
        />
        <button
          ref={ref}
          className={cn(
            "fizzy-button", 
            variant,
            size === "sm" && "text-sm px-3 py-1.5",
            size === "lg" && "text-lg px-6 py-4"
          )}
          onClick={handleClick}
          {...props}
        >
          <div className="fizzy-button-inner">
            {icon && <span className="fizzy-icon">{icon}</span>}
            <span className="fizzy-text">{children}</span>
            <span className="fizzy-tick-wrapper">
              <span className="fizzy-tick">✓</span>
            </span>
            <div className="fizzy-quad">
              {Array.from({ length: 52 }).map((_, i) => (
                <div key={i} className="fizzy-spot" />
              ))}
            </div>
          </div>
        </button>
        {trails.map(trail => (
          <div
            key={trail.id}
            className={cn("fizzy-trail", variant === "secondary" && "fizzy-trail-secondary")}
            style={{
              left: `${trail.x}px`,
              top: `${trail.y}px`,
            }}
          />
        ))}
      </div>
    );
  }
);

FizzyButton.displayName = "FizzyButton";

export { FizzyButton };