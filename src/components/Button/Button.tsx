import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
  type: 'button' | 'submit' | 'reset';
  disabled: boolean;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  type,
  disabled,
  children,
  className,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${styles.button} ${disabled ? styles.disabled : ''} ${className || ''}`}
    >
      {children}
    </button>
  );
};

export default Button;
