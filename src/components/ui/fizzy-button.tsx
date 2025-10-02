import * as React from "react";
import { cn } from "@/lib/utils";
import "./fizzy-button.css";

export interface FizzyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary";
}

const FizzyButton = React.forwardRef<HTMLButtonElement, FizzyButtonProps>(
  ({ className, children, icon, variant = "primary", ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(false);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);

    React.useEffect(() => {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZVRE5WK7q7aZWFApAmuPxxXMpBzGDzPPagDoFJHfH8N+QPgkVXrTp66hVFApGn+DyQGwhBTOGzvLVhzkGHm+/7+OZURE5WK7q7aZWFApAmOPyx3MoBzOEzPPagDoFJHfH8N+QPgkVXrTp66hVFApFnuDyQGwhBTKHzvPVhzkGHm+/7+OZURE5Wa7q7aZWFApAl+Pyx3MoBzOEzPPagDoFJHfH8N+QPgkVXrTp66hVFApFnuDyv2wiBDKHzvLVhzoGHm+/7+OZVRE5Wa7q7aZWFApAl+Pyx3MoBzKEzPPagDoFJHfH8N+QPggVXrTp66hVFApFnuDyv2wiBDKHzvLVhzoGHm+/7+OZVRE5Wa7q7aZWFApAl+Pyx3MoBzKEzPPagDoFJHfH8N+QPggVXrTp66hVFApFnuDyv2wiBDKHzvLVhzoGHm+/7+OZVRE5Wa7q7aZWFApAl+Pyx3MoBzKEzPPagDoFJHfH8N+QPggVXrTp66hVFApFnuDyv2wiBDKHzvLVhzoGHm+/7+OZVRE5Wa7q7aZWFApAl+Pyx3MoBzKEzPPagDoFJHfH8N+QPggVXrTp66hVFApFnuDyv2wiBDKHzvLVhzoGHm+/7+OZVRE5Wa7q7aZWFApAl+Pyx3MoBzKEzPPagDoFJHfH8N+QPggVXrTp66hVFA==');
      audioRef.current.volume = 0.3;
    }, []);

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
      <div className={cn("fizzy-button-wrapper", className)}>
        <input
          id={`fizzy-${Math.random()}`}
          type="checkbox"
          className="fizzy-checkbox"
          checked={isChecked}
          readOnly
        />
        <button
          ref={ref}
          className={cn("fizzy-button", variant)}
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
      </div>
    );
  }
);

FizzyButton.displayName = "FizzyButton";

export { FizzyButton };