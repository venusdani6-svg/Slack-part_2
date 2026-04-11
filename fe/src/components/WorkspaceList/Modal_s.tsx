"use client";

import React, { forwardRef } from "react"; // Import React and forwardRef

// =============================
// Internal className merge utility (replacement for cn)
// =============================
function cx(...classes: (string | undefined | false)[]): string { // Accept multiple class values
  return classes.filter(Boolean).join(" "); // Remove falsy values and join
}

// =============================
// Design Tokens
// =============================
const tokens = {
  radius: "rounded-2xl",
  shadow: "shadow-sm hover:shadow-md",
  border: "border border-gray-200 dark:border-gray-700",
  bg: "bg-white dark:bg-gray-900",
  textPrimary: "text-gray-900 dark:text-gray-100",
  textSecondary: "text-gray-500 dark:text-gray-400",
  ring: "focus:ring-2 focus:ring-purple-400",
};

// =============================
// Variants
// =============================
type Size = "sm" | "md" | "lg";
type Tone = "default" | "primary";

const sizeStyles: Record<Size, string> = {
  sm: "p-4 gap-3 text-sm",
  md: "p-6 gap-4 text-base",
  lg: "p-8 gap-5 text-lg",
};

const toneStyles: Record<Tone, string> = {
  default: "",
  primary: "bg-purple-50 dark:bg-purple-900/20",
};


// =============================
// Props
// =============================
interface TemplateCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  buttonText: string;
  onClick?: () => void;
  size?: Size;
  tone?: Tone;
  disabled?: boolean;
  icon?: string;
}

// =============================
// Component
// =============================
const TemplateCard = forwardRef<HTMLDivElement, TemplateCardProps>(
  (
    {
      title,
      description,
      buttonText,
      onClick,
      size = "md",
      tone = "default",
      disabled = false,
      icon,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cx(
          "w-full max-w-xl flex items-center justify-between transition",
          tokens.radius,
          tokens.shadow,
          tokens.border,
          tokens.bg,
          sizeStyles[size],
          toneStyles[tone],
          className
        )}
        {...props}
      >
        {/* Content */}
        <div className="flex flex-col">
          <h2 className={cx("font-semibold", tokens.textPrimary)}>
            {title}
          </h2>
          <p className={cx("mt-1", tokens.textSecondary)}>
            {description}
          </p>

          {/* Button */}
          <button
            onClick={onClick}
            disabled={disabled}
            aria-label={buttonText}
            className={cx(
              "mt-3 w-fit px-4 py-2 rounded-lg border text-sm font-medium transition focus:outline-none",
              tokens.ring,
              disabled
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
          >
            {buttonText}
          </button>
        </div>

        {/* Icon */}
        <div className="w-20 h-20 md:w-16 md:h-16  dark:bg-purple-800/30 flex items-center justify-center">
          <img src={icon} className="w-16 h-16" alt="" />
        </div>
      </div>
    );
  }
);

TemplateCard.displayName = "TemplateCard";

export default TemplateCard;

