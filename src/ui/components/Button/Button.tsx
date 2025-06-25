import { ButtonType, ButtonVariant } from "@/types";
import React, { FunctionComponent } from "react";
import cx from 'classnames';
import Image from "next/image";
import loadingSpinner from "@/images/loading.svg";

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
}) => {
  return (
    <button
      // TODO: Add conditional classNames
      // - Must have a condition to set the '.primary' className
      // - Must have a condition to set the '.secondary' className
      // - Display loading spinner per demo video. NOTE: add data-testid="loading-spinner" for spinner element (used for grading)
      // className={$.button}
      className={cx($.button, {
        [$.primary]: variant === 'primary',
        [$.secondary]: variant === 'secondary'
      })}
      type={type}
      onClick={onClick}
      disabled={loading}
    >
      {loading && (
        <Image
          src={loadingSpinner}
          alt="Loading spinner"
          width={26}
          height={26}
          className={$.spinner}
          data-testid="loading-spinner"
        />
      )}
      {children}
    </button>
  );
};

export default Button;
