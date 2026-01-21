import * as React from "react";
import { cn } from "@/lib/utils";

interface RadioGroupContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({});

interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
  name?: string;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, name, children, ...props }, ref) => {
    const contextValue = React.useMemo(
      () => ({ value, onValueChange, name }),
      [value, onValueChange, name]
    );

    return (
      <RadioGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn("space-y-2", className)}
          role="radiogroup"
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  id: string;
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, id, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);
    const isChecked = context.value === value;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        context.onValueChange?.(value);
      }
    };

    return (
      <label
        htmlFor={id}
        className={cn(
          "relative inline-flex items-center cursor-pointer",
          props.disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <input
          type="radio"
          ref={ref}
          id={id}
          name={context.name || "radio-group"}
          value={value}
          checked={isChecked}
          onChange={handleChange}
          className="sr-only"
          disabled={props.disabled}
          {...props}
        />
        <div
          className={cn(
            "h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors",
            "focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-primary focus-within:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            isChecked
              ? "border-brand-primary bg-brand-primary"
              : "border-brand-border bg-white",
            className
          )}
        >
          {isChecked && (
            <div className="h-2 w-2 rounded-full bg-white" />
          )}
        </div>
      </label>
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
