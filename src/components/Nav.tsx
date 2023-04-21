import Tippy from '@tippyjs/react';
import React from 'react';
import { VscAccount } from 'react-icons/vsc';
import styles from './Nav.module.css';

function UserPopOver() {
    return (
        <div>
            gogogo
            <input type="text" placeholder="account"/>
            <input type="text" placeholder="password"/>
        </div>
    );
}

export function Nav() {
    return (
        <div className={styles.container}>
            {/* <Tippy content={<UserPopOver/>} placement="right" animation="shift-away">
                <div className={styles.item}>
                    <VscAccount/>
                </div>
            </Tippy> */}
        </div>
    );
}