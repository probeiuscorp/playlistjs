import React from 'react';
import Head from 'next/head';
import Editor from '@monaco-editor/react';

export default function Home() {
    return (
        <main>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Editor
                language="typescript"
                theme="monokai"
                defaultValue="export const sources = {};"
                height="100vh"
            />
        </main>
    );
}