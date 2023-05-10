import { Store } from ':/types';
import NiceModal from '@ebay/nice-modal-react';
import { Provider } from 'jotai/react';
import Head from 'next/head';
import React from 'react';

export type PageProps = React.PropsWithChildren<{
    className?: string
    store?: Store
    title?: string
}>;
export function Page({ className, store, title = 'Playlist.js', children }: PageProps) {
    return (
        <NiceModal.Provider>
            <Provider store={store}>
                <Head>
                    <title>{title}</title>
                </Head>

                <main className={className}>
                    {children}
                </main>
            </Provider>
        </NiceModal.Provider>
    );
}