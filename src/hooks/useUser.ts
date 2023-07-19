import { useSession } from 'next-auth/react';

export function useUser() {
    const session = useSession();
    return session.data?.user?.email ?? undefined;
}