import { Button } from ':/components/Button';
import { Input } from ':/components/Input';
import React, { useState } from 'react';
import { Modal } from '../Modal';
import { Modals } from '../modal';
import styles from './ModalChangeName.module.css';

export const ModalChangeName = Modals.createModal<void, string | null>(({ modal }) => {
    const [value, setValue] = useState('');
    
    const handleCancel = () => {
        modal.resolve(null);
    };
    
    const handleSave = () => {
        modal.resolve(value);
    };
    
    const handleKeyboard: React.KeyboardEventHandler = (e) => {
        if(e.key === 'Enter') handleSave();
        if(e.key === 'Escape') handleCancel();
    };

    return (
        <Modal onClose={() => modal.resolve(null)}>
            <Modal.Content>
                <Input
                    autoFocus
                    className={styles.input}
                    value={value}
                    setValue={setValue}
                    onKeyUp={handleKeyboard}
                />
            </Modal.Content>
            <Modal.Buttons>
                <Button secondary onClick={handleCancel}>
                    Cancel
                </Button>
                <Button primary onClick={handleSave}>
                    Save
                </Button>
            </Modal.Buttons>
        </Modal>
    );
});