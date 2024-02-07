import React from 'react';
import { HomeSignedIn } from ':/components/home/HomeSignedIn';
import { HomeSignedOut } from ':/components/home/HomeSignedOut';
import { getServerSession } from 'next-auth';
import { GetServerSidePropsContext } from 'next';
import { authOptions } from './api/auth/[...nextauth]';
import { WorkspaceData, findWorkspacesByUser } from ':/models/Workspaces';
import { Provider } from 'next-auth/providers';
import { getProviders } from 'next-auth/react';

export type PageHomeProps = {
    user: string | null
    workspaces: WorkspaceData[] | null
    provider: Provider
}
export default function PageHome({ user, workspaces, provider }: PageHomeProps) {
    if(user) {
        return <HomeSignedIn user={user} initialWorkspaces={workspaces}/>;
    } else {
        return <HomeSignedOut provider={provider.id}/>;
    }
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const [{ user, workspaces }, providers] = await Promise.all([
        (async () => {
            const session = await getServerSession(context.req, context.res, authOptions);
            const user = session?.user?.email ?? null;
            const workspaces = user ? await findWorkspacesByUser(user) : null;
            return { user, workspaces };
        })(),
        getProviders(),
    ]);

    return {
        props: {
            user,
            workspaces: workspaces?.map((workspace) => workspace.data) ?? null,
            provider: providers!.google,
        },
    };
}