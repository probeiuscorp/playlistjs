import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';

const NO_SESSION = Symbol('NO_SESSION');

type GetUser = {
    (): Promise<string>
    (kind: 'optional'): Promise<string | undefined>
}
export function handler<T = unknown>(callback: (req: NextApiRequest, res: NextApiResponse<T>, getUser: GetUser) => void) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            // @ts-expect-error: The overloads are really messing with TypeScript
            const getUser: GetUser = async function(kind) {
                const session = await getServerSession(req, res, authOptions);
                const userId = session?.user?.email ?? undefined;
                if(kind !== 'optional' && userId === undefined) {
                    throw NO_SESSION;
                }

                return userId;
            };
            await callback(req, res, getUser);
        } catch(e) {
            if(e === NO_SESSION) {
                res.status(401).send('You must be authenticated and are not.');
            } else {
                throw e;
            }
        }
    };
}