import React from 'react';
import { Page } from '../Page';
import { Button, ButtonGroup, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import { VscGithub } from 'react-icons/vsc';

export function HomeSignedOut() {
    return (
        <Page title="playlistjs">
            <Flex direction="column" alignItems="center">
                <VStack mt={8} mb={4}>
                    <Heading fontFamily="GT Pressura Mono">
                        playlistjs
                    </Heading>
                    <Text color="gray.300" fontSize="xl">
                        because lists are boring
                    </Text>
                </VStack>
                <ButtonGroup spacing={2} size="lg">
                    <Button colorScheme="teal" onClick={() => signIn()}>
                        Sign in|up
                    </Button>
                    <Button
                        leftIcon={<VscGithub size="1.5em"/>}
                        as='a'
                        href='https://github.com/probeiuscorp/playlistjs'
                        target="__blank"
                    >
                        GitHub
                    </Button>
                </ButtonGroup>
            </Flex>
        </Page>
    );
}