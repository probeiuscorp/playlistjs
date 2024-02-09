import { AppProps } from 'next/app';
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ChakraProvider, extendTheme, type localStorageManager } from '@chakra-ui/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/material.css';
import 'tippy.js/animations/shift-away.css';
import '../styles/globals.css';

const theme = extendTheme({
    config: {
        initialColorMode: 'dark',
        useSystemColorMode: false,
    },
    fonts: {
        heading: 'Inter',
        body: 'Open Sans',
    },
});

const justMakeItDarkThemeMan: typeof localStorageManager = {
    type: 'localStorage',
    get: () => 'dark',
    set: () => undefined,
    ssr: false,
};

export default function App({ Component, pageProps: { session, ...pageProps }}: AppProps) {
    return (
        <SessionProvider session={session}>
            <ChakraProvider
                theme={theme}
                colorModeManager={justMakeItDarkThemeMan}
                toastOptions={{ defaultOptions: { position: 'bottom-right' }}}
                resetCSS
            >
                <Component {...pageProps}/>
            </ChakraProvider>
        </SessionProvider>
    );
}