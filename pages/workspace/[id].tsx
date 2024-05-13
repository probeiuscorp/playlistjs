import { PageWorkspace } from ':/components/workspace/PageWorkspace';
import { GetServerSideProps } from 'next';
import { WorkspaceDataHosted, findWorkspaceById } from ':/models/Workspaces';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';

export default PageWorkspace;

export const getServerSideProps: GetServerSideProps<WorkspaceDataHosted> = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);
    if(session === null)
        return { notFound: true };

    const id = context.params?.id;
    if(typeof id !== 'string')
        return { notFound: true };
    
    const workspace = await findWorkspaceById(id, session.user?.email);
    if(workspace === null)
        return { notFound: true };

    if(workspace.data.type !== 'hosted')
        return { notFound: true };

    return {
        props: workspace.data,
    };
};