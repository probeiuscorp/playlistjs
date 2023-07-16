import React from 'react';
import Head from 'next/head';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
    const session = useSession();

    let content: React.ReactNode;
    if(session.data) {
        content = (
            <React.Fragment>
                Signed in as {session.data.user?.email}
                <button onClick={() => signOut()}>
                    Sign out
                </button>
            </React.Fragment>
        );
    } else {
        content = (
            <React.Fragment>
                Not signed in <br/>
                <button onClick={() => signIn()}>
                    Sign in
                </button>
            </React.Fragment>
        );
    }

    return (
        <main>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {content}
        </main>
    );
}