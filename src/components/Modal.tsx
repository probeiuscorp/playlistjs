import { createEventListener, merge } from ':/util';
import { useModal } from '@ebay/nice-modal-react';
import React, { useEffect, useState } from 'react';
import styles from './Modal.module.css';

/**
 * In milliseconds
 */
export const MODAL_ANIMATE_OUT_TIME = 120;

export type ModalProps = {
    tabIndex?: number,
    onClose(): void
};
export function Modal({ children, tabIndex, onClose }: React.PropsWithChildren<ModalProps>) {
    useEffect(() => createEventListener('keyup', (e) => {
        if(e.key === 'Escape') {
            onClose();
        }
    }), []);
    
    const [status, setStatus] = useState<'opening' | 'opened' | 'closing'>('opening');
    useEffect(() => {
        setStatus('opened');
    }, []);

    const modal = useModal();

    const animationStyle = status === 'opening'
        ? false
        : modal.visible === false
            ? styles.closing
            : styles.open;

    return (
        <React.Fragment>
            <div className={merge(styles.background, animationStyle)} onClick={onClose}/>
            <aside
                className={merge(styles.modal, animationStyle)}
                tabIndex={tabIndex}
            >
                {children}
            </aside>
        </React.Fragment>
    );
}

export type ModalContentProps = {
    // pass
};
Modal.Content = function ModalContent({ children }: React.PropsWithChildren<ModalContentProps>) {
    return (
        <div className={styles.content}>
            {children}
        </div>
    );
};

export type ModalButtonsProps = {
    // pass
};
Modal.Buttons = function ModalButtons({ children }: React.PropsWithChildren<ModalButtonsProps>) {
    return (
        <div className={styles.buttons}>
            {children}
        </div>
    );
};

export type ModalTitleProps = {
    // pass
};
Modal.Title = function ModalTitle({ children }: React.PropsWithChildren<ModalTitleProps>) {
    return (
        <div className={styles.title}>
            {children}
        </div>
    );
};