import { ButtonType, ButtonVariant } from "@/types";
import React, { FunctionComponent } from "react";

import $ from "./Button.module.css";

interface ButtonProps {
  onClick?: () => void;
  type?: ButtonType;
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: FunctionComponent<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  loading = false,
}) => {  // Build className with conditional variants
  const buttonClassName = [
    $.button,
    variant === 'primary' ? $.primary : '',
    variant === 'secondary' ? $.secondary : '',
    variant === 'clear' ? $.clear : ''
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClassName}
      type={type}
      onClick={onClick}
      disabled={loading}
    >
      {loading && (
        <span className={$.spinner} data-testid="loading-spinner"></span>
      )}
      {children}
    </button>
  );
};

export default Button;
