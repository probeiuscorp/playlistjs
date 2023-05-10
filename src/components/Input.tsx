import { merge } from ':/util';
import React from 'react';
import styles from './Input.module.css';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    value: string
    setValue(next: string): void
}
export function Input({ value, setValue, className, ...props }: InputProps)  {
    return (
        <input
            className={merge(styles.input, className)}
            value={value}
            onChange={e => setValue(e.target.value)}
            {...props}
        />
    );
}