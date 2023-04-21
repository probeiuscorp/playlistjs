import { AppProps } from 'next/app';
import React from 'react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/material.css';
import 'tippy.js/animations/shift-away.css';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Component {...pageProps}/>
    );
}