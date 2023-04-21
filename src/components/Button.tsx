import { merge } from ':/util';
import React from 'react';
import styles from './Button.module.css';

export type ButtonsProps = {
    primary?: boolean,
    secondary?: boolean,
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
export function Button({ primary, secondary, children, className, ...props }: React.PropsWithChildren<ButtonsProps>) {
    return (
        <button
            className={merge(
                styles.button,
                className,
                primary ? styles.primary : styles.secondary,
            )}
            {...props}
        >
            {children}
        </button>
    );
}