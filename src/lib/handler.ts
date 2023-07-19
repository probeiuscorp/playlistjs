import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';

const NO_SESSION = Symbol('NO_SESSION');

export function handler<T = unknown>(callback: (req: NextApiRequest, res: NextApiResponse<T>, getUser: () => Promise<string>) => void) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            await callback(req, res, async () => {
                const session = await getServerSession(req, res, authOptions);
                const userId = session?.user?.email ?? undefined;
                if(userId === undefined) {
                    throw NO_SESSION;
                }

                return userId;
            });
        } catch(e) {
            if(e === NO_SESSION) {
                res.status(401).send('You must be authenticated and are not.');
            } else {
                throw e;
            }
        }
    };
}