import React from 'react';
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { resetServerContext } from 'react-beautiful-dnd';

export default function PlaylistJS() {
    return (
        <Html>
            <Head>
                <link rel="icon" href="/favicon.ico"/>
                <link href="http://fonts.cdnfonts.com/css/gt-pressura-mono" rel="stylesheet"/>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
                <link href="https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Inter&family=Manrope:wght@600&display=swap" rel="stylesheet"/>
            </Head>
            <body>
                <Main/>
                <NextScript/>
            </body>
        </Html>
    );
}

PlaylistJS.getInitialProps = async function(ctx: DocumentContext) {
    const [page, initialProps] = await Promise.all([ctx.renderPage(), Document.getInitialProps(ctx)]);
    resetServerContext();
    return { ...initialProps, ...page };
};