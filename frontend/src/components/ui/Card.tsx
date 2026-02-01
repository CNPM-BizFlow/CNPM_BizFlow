'use client';
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: string;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    padding = 'p-6'
}) => {
    return (
        <div className={`bg-white rounded-xl border border-slate-200 card-shadow ${padding} ${className}`}>
            {children}
        </div>
    );
};
