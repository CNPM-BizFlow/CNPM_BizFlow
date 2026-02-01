'use client';
import React from 'react';
import { CircleNotch } from '@phosphor-icons/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    variant = 'primary',
    isLoading = false,
    leftIcon,
    rightIcon,
    disabled,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:pointer-events-none text-base";

    const variants = {
        primary: "bg-primary text-white hover:bg-primary-hover shadow-md shadow-teal-900/10",
        secondary: "bg-secondary text-white hover:bg-secondary-hover shadow-md shadow-orange-900/10",
        outline: "border-2 border-slate-200 text-slate-700 hover:border-primary hover:text-primary bg-transparent",
        ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
        danger: "bg-error text-white hover:opacity-90",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading && <CircleNotch className="animate-spin" size={20} />}
            {!isLoading && leftIcon}
            <span>{children}</span>
            {!isLoading && rightIcon}
        </button>
    );
};
