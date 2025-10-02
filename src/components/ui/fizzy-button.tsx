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

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsChecked(true);
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
