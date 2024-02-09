import { PageListen } from ':/components/listen/PageListen';
import { WorkspaceData, findWorkspaceById } from ':/models/Workspaces';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';

export default PageListen;

export const getServerSideProps: GetServerSideProps<WorkspaceData> = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);
    const id = context.params?.id;
    if(typeof id !== 'string') return { notFound: true };

    const workspace = await findWorkspaceById(id, session?.user?.email, 'readonly');
    if(workspace !== null) {
        return { props: workspace.data };
    } else {
        return { notFound: true };
    }
};