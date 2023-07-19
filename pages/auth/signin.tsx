import React from 'react';
import { Page } from ':/components/Page';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getServerSession } from 'next-auth';
import { getProviders, signIn } from 'next-auth/react';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { Button, Center, Flex, Text } from '@chakra-ui/react';

export default function PageSignIn({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <Page title="Sign in">
            <Center height="100vh">
                <Flex p={4} mb={8} gap={2} width={360} direction="column">
                    <Text textAlign="center" fontSize="xl">
                        Sign In
                    </Text>
                    <Button onClick={() => signIn(providers.google.id)}>
                        with Google
                    </Button>
                    <Button onClick={() => signIn(providers.google.id)}>
                        with GitHub
                    </Button>
                </Flex>
            </Center>
        </Page>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);
    if(session) {
        return {
            redirect: {
                destination: '/',
            },
        };
    }

    const providers = await getProviders();
    return {
        props: {
            providers: providers ?? ({} as any as typeof providers & {}),
        },
    };
}