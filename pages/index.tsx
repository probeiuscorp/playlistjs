import React from 'react';
import { HomeSignedIn } from ':/components/home/HomeSignedIn';
import { HomeSignedOut } from ':/components/home/HomeSignedOut';
import { getServerSession } from 'next-auth';
import { GetServerSidePropsContext } from 'next';
import { authOptions } from './api/auth/[...nextauth]';
import { WorkspaceData, findWorkspacesByUser } from ':/models/Workspaces';

export type PageHomeProps = {
    user: string | null
    workspaces: WorkspaceData[] | null
}
export default function PageHome({ user, workspaces }: PageHomeProps) {
    if(user) {
        return <HomeSignedIn user={user} initialWorkspaces={workspaces}/>;
    } else {
        return <HomeSignedOut/>;
    }
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);
    const user = session?.user?.email ?? null;
    const workspaces = user ? await findWorkspacesByUser(user) : null;

    return {
        props: {
            user: session?.user?.email ?? null,
            workspaces: workspaces?.map((workspace) => workspace.data) ?? null,
        },
    };
}