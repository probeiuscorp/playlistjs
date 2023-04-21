import { Nav } from ':/components/Nav';
import { Provider } from 'jotai/react';
import Head from 'next/head';
import React from 'react';
import styles from './listen.module.css';

export default function Listen() {
    return (
        <Provider>
            <Head>
                <title>Listen</title>
            </Head>

            <main className={styles.app}>
                <Nav/>
                <div className={styles.listen}>
                    
                </div>
            </main>
        </Provider>
    );
}